import axios from 'axios';
import cheerio from 'cheerio';

// Fungsi untuk mengambil semua karakter dari halaman utama
async function getAllCharacters() {
    try {
        const response = await axios.get('https://genshin.gg/star-rail/');
        const html = response.data;
        const $ = cheerio.load(html);
        const characters = [];

        $('.character-list .character-portrait').each((i, el) => {
            const href = $(el).attr('href');
            const name = href.split('/').filter(part => part !== '').pop(); // Mengambil bagian terakhir dari URL setelah dibersihkan
            characters.push(name.toLowerCase());
        });

        return characters;
    } catch (error) {
        console.error('Error fetching all characters:', error);
        throw new Error('Failed to fetch characters from genshin.gg');
    }
}

// Fungsi untuk melakukan scraping karakter dari URL yang diberikan
async function info(query) {
    try {
        // Mengambil daftar semua karakter
        const allCharacters = await getAllCharacters();

        // Mengecek apakah query ada dalam daftar karakter
        if (!allCharacters.includes(query.toLowerCase())) {
            return {
                message: 'Character not found. Did you mean one of these?',
                name: allCharacters
            };
        }

        // Mengambil data HTML dari URL yang diberikan
        const response = await axios.get(`https://genshin.gg/star-rail/characters/${query}/`);
        const html = response.data;
        const $ = cheerio.load(html);

        // Mendefinisikan objek untuk menyimpan data karakter
        let character = {
            name: '',
            element: '',
            path: '',
            imageUrl: '',
            stats: {},
            materials: [],
            skills: [],
            eidolons: [],
            traces: []
        };

        // Mengambil nama karakter
        character.name = $('.character-info-name').text().trim();

        // Mengambil elemen karakter
        character.element = $('.character-info-element').attr('alt');

        // Mengambil path karakter
        character.path = $('.character-info-path img').attr('alt');

        // Mengambil URL gambar karakter
        character.imageUrl = $('.character-info-portrait').attr('src');

        // Mengambil stats karakter
        $('.character-info-stats .character-info-stat').each((i, el) => {
            const statName = $(el).find('.character-info-stat-name').text().trim();
            const statValue = $(el).find('.character-info-stat-value').text().trim();
            character.stats[statName] = statValue;
        });

        // Mengambil upgrade materials
        $('.character-info-materials-item').each((i, el) => {
            const material = {
                name: $(el).find('.character-info-materials-name').text().trim(),
                icon: $(el).find('img').attr('src')
            };
            character.materials.push(material);
        });

        // Mengambil skills karakter
        $('#skills .character-info-skill').each((i, el) => {
            const skill = {
                title: $(el).find('.character-info-skill-title').text().trim(),
                name: $(el).find('.character-info-skill-name').text().trim(),
                type: $(el).find('.character-info-skill-type').text().trim(),
                description: $(el).find('.character-info-skill-description').text().trim(),
                icon: $(el).find('.character-info-skill-icon').attr('src')
            };
            character.skills.push(skill);
        });

        // Mengambil eidolons karakter
        $('#eidolons .character-info-skill').each((i, el) => {
            const eidolon = {
                title: $(el).find('.character-info-skill-title').text().trim(),
                name: $(el).find('.character-info-skill-name').text().trim(),
                description: $(el).find('.character-info-skill-description').text().trim(),
                icon: $(el).find('.character-info-skill-icon').attr('src')
            };
            character.eidolons.push(eidolon);
        });

        // Mengambil traces karakter
        $('#traces .character-info-skill').each((i, el) => {
            const trace = {
                title: $(el).find('.character-info-skill-title').text().trim(),
                name: $(el).find('.character-info-skill-name').text().trim(),
                description: $(el).find('.character-info-skill-description').text().trim(),
                icon: $(el).find('.character-info-skill-icon').attr('src')
            };
            character.traces.push(trace);
        });

        // Mengembalikan hasil scraping
        return character
    } catch (error) {
        console.error('Error:', error);
        return error.message
        
    }
}

// Fungsi untuk melakukan scraping light cones
async function lightcones() {
    try {
        // Mengambil data HTML dari halaman light cones
        const { data } = await axios.get('https://genshin.gg/star-rail/light-cones/');
        const $ = cheerio.load(data);
        
        // Menyimpan data light cones
        const lightCones = [];
        
        // Mengambil data light cones
        $('.light-cones-item').each((index, element) => {
            const name = $(element).find('.light-cones-name').text();
            const rarity = $(element).find('img.light-cones-image').attr('class').match(/rarity-\d/)[0].split('-')[1];
            const path = $(element).find('.light-cones-path').text().trim();
            const bonus = $(element).find('.light-cones-bonus').text();
            const description = $(element).find('.light-cones-description').text().trim();
            
            lightCones.push({
                name,
                rarity,
                path,
                bonus,
                description
            });
        });
        
        return lightCones;
    } catch (error) {
        console.error(`Error scraping data: ${error}`);
        return [];
    }
}

export { info, lightcones };