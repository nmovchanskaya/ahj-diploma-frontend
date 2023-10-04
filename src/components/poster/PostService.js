import createRequest from '../../api/createRequest';

/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class PostService {
  async list(callback) {
    createRequest({
      sendMethod: 'GET',
      method: 'allPosts',
      callback,
    });
  }

  async get(id, callback) {
    createRequest({
      sendMethod: 'GET',
      method: 'postById',
      id,
      callback,
    });
  }

  async create(data, callback) {
    createRequest({
      sendMethod: 'POST',
      method: 'createPost',
      data,
      callback,
    });
  }

  async filter(data, callback) {
    createRequest({
      sendMethod: 'POST',
      method: 'filterPosts',
      data,
      callback,
    });
  }

  async upload(data, callback) {
    createRequest({
      sendMethod: 'PUT',
      method: 'upload',
      data,
      callback,
    });
  }
}
