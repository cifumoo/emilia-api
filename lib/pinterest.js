import { fetch } from "undici";
import { URL } from "url";

class Pinterest {
  constructor() {
    this.maxVideoDuration = Infinity;
  }

  getId(input) {
    const matchResult = input.match(/(?:pin\/|\/pin\/)?(\d+)/);
    return matchResult ? matchResult[1] ?? "ID tidak ditemukan" : "ID tidak ditemukan";
  }

  async download(link) {
    const pinId = this.getId(link);
    if (!pinId) return { error: "Gagal mendapatkan ID" };

    try {
      const response = await fetch("https://www.pinterest.com/resource/PinResource/get?data=" + encodeURIComponent(JSON.stringify({
        options: {
          field_set_key: "unauth_react_main_pin",
          id: pinId
        }
      })));

      if (!response.ok) return console.error("Gagal mengambil data"), { error: "Gagal mengambil data" };

      const responseData = (await response.json()).resource_response.data;
      if (!responseData) return console.error("Gagal mengambil data"), { error: "Gagal mengambil data" };

      const video = responseData.videos?.video_list?.V_720P ?? responseData.story_pin_data?.pages[0]?.blocks[0]?.video?.video_list?.V_EXP7;
      if (video) {
        if (video.duration > this.maxVideoDuration) {
          console.warn(`Durasi video melebihi batas: ${this.maxVideoDuration / 60000} menit`);
        }
        return { type: "video", url: video.url };
      }

      const images = responseData.images.orig;
      if (images) {
        return { type: "image", url: images.url };
      }

      return console.error("Gagal mengambil data"), { error: "Gagal mengambil data" };

    } catch (error) {
      return console.error("Error:", error.message), { error: "Gagal mengambil data" };
    }
  }

  async search(query) {
    const queryParams = {
        source_url: "/search/pins/?q=" + encodeURIComponent(query),
        data: JSON.stringify({
          options: {
            isPrefetch: false,
            query: query,
            scope: "pins",
            no_fetch_context_on_resource: false
          },
          context: {}
        }),
        _: Date.now()
      },
      url = new URL("https://www.pinterest.com/resource/BaseSearchResource/get/");

    Object.entries(queryParams).forEach(entry => url.searchParams.set(entry[0], entry[1]));

    try {
      const json = await (await fetch(url.toString())).json();
      return (json.resource_response?.data?.results ?? []).map(item => ({
        pin: "https://www.pinterest.com/pin/" + item.id ?? "",
        link: item.link ?? "",
        created_at: new Date(item.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }) ?? "",
        id: item.id ?? "",
        images_url: item.images?.["736x"].url ?? "",
        grid_title: item.grid_title ?? ""
      }));
    } catch (error) {
      return console.error("Error mengambil data:", error), [];
    }
  }
}

export { Pinterest };