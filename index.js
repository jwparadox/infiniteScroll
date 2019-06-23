

window.onload = () => {


    let element = document.querySelector('.json-container');
    let scroll = new InfiniteScroll(element, {});

    const config = {
        threshold: 300,
        scrollElement: false,
        renderItem: function(item){
            let url = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}`;
            let title = item.title;
            return `<img src="${url}" alt="${title}">`;
        }
    }
    let image = document.querySelector('.image-container');
    let scrollImage = new InfiniteScroll(image, config);
}