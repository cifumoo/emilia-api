import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { randomUUID } from 'crypto';
import mime from 'mime-types';
import fs from 'fs';
import axios from 'axios';
import tmp from 'tmp';

// Function to download a file from a URL
async function downloadFile(url) {
  const mimeType = await axios.head(url).then(response => response.headers['content-type']);
  const fileName = generateRandomFileName(mimeType);

  const tmpFile = tmp.fileSync({ postfix: `.${mime.extension(mimeType)}` });
  const localPath = tmpFile.name;

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);
    writer.on('finish', () => resolve({ localPath, mimeType, tmpFile }));
    writer.on('error', reject);
  });
}

// Function to generate random file name based on MIME type
function generateRandomFileName(mimeType) {
  return `${randomUUID()}.${mime.extension(mimeType)}`;
}

// Function to upload video file to GoogleAIFileManager
async function uploadVideoFile(apiKey, filePath, mimeType) {
  const fileManager = new GoogleAIFileManager(apiKey);
  const displayName = generateRandomFileName(mimeType);

  // Upload the file and specify a display name.
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: mimeType,
    displayName: displayName,
  });

  console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);
  return uploadResponse.file;
}

// Function to check file processing status
async function checkFileProcessingStatus(apiKey, fileName) {
  const fileManager = new GoogleAIFileManager(apiKey);

  // Poll getFile() on a set interval (10 seconds here) to check file state.
  let file = await fileManager.getFile(fileName);
  while (file.state === FileState.PROCESSING) {
    process.stdout.write(".");
    // Sleep for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    // Fetch the file from the API again
    file = await fileManager.getFile(fileName);
  }

  if (file.state === FileState.FAILED) {
    throw new Error("Video processing failed.");
  }

  console.log(`File ${file.displayName} is ready for inference as ${file.uri}`);
  return file;
}

// Function to generate content from video using GoogleGenerativeAI
async function generateContentFromVideo(apiKey, modelType, file, textPrompt) {
  const genAI = new GoogleGenerativeAI(apiKey);

  // Choose a Gemini model.
  const model = genAI.getGenerativeModel({
    model: modelType,
  });

  // Generate content using text and the URI reference for the uploaded file.
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: file.mimeType,
        fileUri: file.uri,
      },
    },
    { text: textPrompt },
  ]);

  // Handle the response of generated text
  return result.response.text();
}

// Main function to handle the entire process
export async function Gemini(textPrompt, fileUrl) {
  const apiKey = 'AIzaSyB2mvsGVTZAU-h-GtCLzoLhjHEdvugx9uQ'; // Replace with your actual API key

  // Download the file from the URL
  const { localPath, mimeType, tmpFile } = await downloadFile(fileUrl);
  console.log('File downloaded successfully');

  // Upload the video file
  const file = await uploadVideoFile(apiKey, localPath, mimeType);

  // Check file processing status
  const processedFile = await checkFileProcessingStatus(apiKey, file.name);

  // Generate content from the processed video file
  const resultText = await generateContentFromVideo(apiKey, 'gemini-1.5-pro', processedFile, textPrompt);

  // Clean up local file
  tmpFile.removeCallback();

  return resultText;
}