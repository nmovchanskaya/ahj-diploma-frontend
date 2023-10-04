import PostWidget from './components/poster/postWidget';

const postWidget = new PostWidget('.container');
//postWidget.init();
postWidget.bindToDOM();
postWidget.renderContent();
