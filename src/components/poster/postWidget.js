import Position from './position';
import Timer from './timer';
import Post from './post';
import PostList from './postList';
import PostService from './PostService';
import FileUploader from '../files/fileUploader';
import WarningShow from '../warning/warningShow';
import VideoRec from '../media/videoRec';

export default class PostWidget {
  constructor(containerName) {
    // set urls to the server
    if (process.env.NODE_ENV === 'development') {
      this.urlServer = 'http://localhost:3000';
    }
    else {
      //this.urlServer = 'http://localhost:3000';
      this.urlServer = 'https://ahj-diploma-backend.onrender.com';
    }

    this.containerName = containerName;
    this.postService = new PostService(this.urlServer);
    this.postList = new PostList(this.postService);

    this.onAddSubmit = this.onAddSubmit.bind(this);
    this.onAddLocation = this.onAddLocation.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  addFormMarkup() {
    return `
        <form class="create-post" name="create-post">
            <input type="text" class="post-text" name="post-text"> 
            <span class="post-video material-icons">videocam</span>
        </form>
        <div class="buttons">
          <form class="upload-form"> 
            <span class="location-btn material-symbols-outlined">location_on</span>
            <div class="file-container">
              <input class="overlapped file-input" name="file" type="file" accept="image, video, audio">
              <span class="file-btn material-symbols-outlined">note_stack_add</span>
            </div>
          </form>
        </div>
        `;
  }

  bindToDOM() {
    this.container = document.querySelector(this.containerName);
  }

  bindToDOMAdd() {
    this.form = document.querySelector('.create-post');
    this.inputElem = this.form.querySelector('.post-text');
    this.locationBtn = document.querySelector('.location-btn');
    this.searchInput = document.querySelector('.search-input');
    this.searchForm = document.querySelector('.search-form');
    this.searchBtn = document.querySelector('.search-icon');
    this.filterElem = document.querySelector('.filter-attach');

    this.form.addEventListener('submit', this.onAddSubmit);
    this.locationBtn.addEventListener('click', this.onAddLocation);
    this.searchForm.addEventListener('submit', this.onSearchSubmit);
    this.searchBtn.addEventListener('click', this.onSearchSubmit);
    this.filterElem.addEventListener('click', this.onFilter);
  }

  renderPost(post) {
    const date = new Date(post.date);
    if (post.type === 'video') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              <video class="${post.content.className}" src="${post.content.src}" controls>
              </video>
            </div>
        </div>
    `;
    }
    if (post.type === 'url') {
      return `
          <div class="post" data-id="${post.id}">
              <div class="post__date">
                ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
              </div>
              <div class="post__content">
                <a href="${post.content}">${post.content}</a>
              </div>
          </div>
      `;
    }
    if (post.type === 'loc') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              [${post.content.lat}, ${post.content.long}]
            </div>
        </div>
    `;
    }
    if (post.type === 'img') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              <a download href="${post.content}" rel="noopener" name="abc">
                <img class="post__img" src="${post.content}">
              </a>
            </div>
        </div>
    `;
    }
    if (post.type === 'vid') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              <video class="video-post" controls src="${post.content}"></video>
            </div>
        </div>
    `;
    }
    if (post.type === 'aud') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              <audio controls src="${post.content}"></audio>
            </div>
        </div>
    `;
    }

    return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              ${post.content}
            </div>
        </div>
    `;
  }

  renderPosts() {
    const div = document.createElement('div');
    div.className = 'post-container';
    this.container.insertBefore(div, this.form);

    this.postService.list((posts) => {
      posts.forEach((item) => {
        const elemCode = this.renderPost(item);
        div.insertAdjacentHTML('beforeend', elemCode);
      });

      this.postContainer = div;

      // scroll container to the bottom
      setTimeout(() => { this.container.scrollTop = this.container.scrollHeight; }, 100);
    });
  }

  renderContent() {
    // render list of posts
    this.renderPosts();

    // render add form
    const addForm = document.createElement('form');
    addForm.className = 'create-post';
    addForm.name = 'create-post';
    addForm.innerHTML = this.addFormMarkup();
    this.container.insertBefore(addForm, null);

    // add listeners
    this.bindToDOMAdd();

    // render warning form
    this.warningShow = new WarningShow(this.container);
    this.warningShow.bindToDOM();

    // create new FileUploader
    this.fileUploader = new FileUploader(this.form, this.postService, this.createPostShowAll.bind(this), this.urlServer);
    this.fileUploader.bindToDOM();

    // create new VideoRec
    this.videoRec = new VideoRec(this.form, this.createPostShowAll.bind(this), this.postService, this.urlServer);
    this.videoRec.bindToDOM();
  }

  clearPosts() {
    const posts = Array.from(this.postContainer.querySelectorAll('.post'));
    posts.forEach((item) => {
      item.remove();
    });
  }

  updatePosts(searchedPosts) {
    // if we show only searched posts
    if (searchedPosts) {
      searchedPosts.forEach((item) => {
        const elemCode = this.renderPost(item);
        this.postContainer.insertAdjacentHTML('beforeend', elemCode);
      });
    } else {
      // if we show all posts
      this.postService.list((posts) => {
        posts.forEach((item) => {
          const elemCode = this.renderPost(item);
          this.postContainer.insertAdjacentHTML('beforeend', elemCode);
        });
      });
    }

    // scroll container to the bottom
    setTimeout(() => { this.container.scrollTop = this.container.scrollHeight; }, 100);
  }

  async createPostShowAll(content, type) {
    const post = new Post(content, type);

    const posts = await this.postList.add(post);

    this.inputElem.value = '';

    // refresh list of posts
    this.clearPosts();
    this.updatePosts(posts);
  }

  onAddSubmit(e) {
    e.preventDefault();

    const text = this.inputElem.value.trim();
    if (this.isValidURL(text)) {
      this.createPostShowAll(text, 'url');
    } else {
      this.createPostShowAll(text, 'text');
    }
  }

  isValidURL(str) {
    if (/^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$/g.test(str)) {
      return true;
    }
    return false;
  }

  async onAddLocation(e) {
    e.preventDefault();

    let position;
    try {
      position = await Position.getPosition();
    } catch {
      // if we don't have coordinates ask for input
      position = await this.warningShow.showWarning();
    }

    this.createPostShowAll(position, 'loc');
  }

  async onSearchSubmit(e) {
    e.preventDefault();

    let searchedPosts;
    const searchedText = this.searchInput.value.trim();
    if (searchedText) {
      searchedPosts = await this.postList.filter('content', searchedText);
    }

    // refresh list of posts
    this.clearPosts();
    this.updatePosts(searchedPosts);
  }

  async onFilter(e) {
    let filteredPosts;
    if (e.target.classList.contains('filter_img')) {
      filteredPosts = await this.postList.filter('type', 'img');
    } else if (e.target.classList.contains('filter_video')) {
      filteredPosts = await this.postList.filter('type', 'vid');
    } else if (e.target.classList.contains('filter_audio')) {
      filteredPosts = await this.postList.filter('type', 'aud');
    }

    // refresh list of posts
    this.clearPosts();
    this.updatePosts(filteredPosts);
  }
}
