const handleResponse = (response) => {
    if(!response.ok) {
        throw Error('Failed to get data');
    }
    return response.json();
}

const API_URL = "https://api.flickr.com/services/rest";
const API_KEY = "18470d9eeeb3597104c30f05a72269a8";
const params =  {
    "method": "flickr.photos.search",
    "api_key": API_KEY,
    "per_page": 24,
    "format": 'json',
    "nojsoncallback": 1,
    "page": 1,
    "text": 'cat'
};

const defaultOptions = {
    threshold: 100,
    scrollElement: true,
    throttle: 300
};

class InfiniteScroll{
    constructor(ele, options){
        this.element = ele;
        this.options = Object.assign({}, defaultOptions, options); 
        if( !this.element) {
            throw new Error('Element or url are required!');
        }
        
        this.renderResult = options.renderResult || this.renderResult;
        this.getUrl = options.getUrl || this.getUrl;

        this._onScroll = this.onScroll.bind(this);
        this._renderItem = this.renderItem.bind(this);
        this.init();
    }

    init(){
        this.addListeners();
        this.fetchResult();
    }   
    
    addListeners(){
        if (this.scrollElement) {
            this.element.addEventListner('scroll', this._onScroll);
        } else {
            document.addEventListener('scroll', this._onScroll);
        }
    }

    getUrl(){
        return  API_URL + Object.keys(params).map(key=>{
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    }

    fetchResult(){
        fetch(this.getUrl())
            .then(handleResponse)
            .then(this.render(data))
            .catch(this.handleError);
    }

    onScroll(){
        let inThrottle;
        if (!inThrottle && this.needFetch()) {
            this.fetchResult();
            inThrottle = true;
            setTimeout(()=> inThrottle = false, this.options.throttle);
        } 
    }

    needFetch(){
        if(this.scrollElement) {
            return this.element.scrollHeight - this.element.scrollTop - this.element.clientHeight <= this.options.threshold;
        } else {
            return document.scrollHeight - (window.scrollTop + window.height) <= this.options.threshold;
        }
    }

    render(data){
        this.params.page  += 1;
        data.photos.photo.forEach((item) => {
            let node = document.createElement('div');
            node.innerHTML = this._renderItem(item);
            this.element.appendChild(node);
        });
    }

    renderItem(item){
        return `<div><code>${JSON.stringify(item)}</code></div>`;
    }

}