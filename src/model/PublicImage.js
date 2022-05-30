export class PublicImage {

    constructor() {
        this.baseUrl = `${process.env.CDN_URL}/images/public`;
    }

    generateImageList() {
        const imageList = Array.from(new Array(46)).map((v, i) => {
            const [url, name] = [`${this.baseUrl}/${i + 1}.png`, `${i + 1}.png`];
            return {
                coverUrl: url,
                viewUrl: url,
                fileId: name,
                name,
                qgFileDetail: {
                    fileExt: '.png'
                }
            }
        })
        return imageList;
    }

    getImageUrl(id) {
        return `${this.baseUrl}/${id}`;
    }

}
