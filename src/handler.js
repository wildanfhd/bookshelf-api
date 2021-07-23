const { nanoid } = require('nanoid');
const books = require('./books');

const saveBooksHandler = (request, h) => {
  const id = nanoid(16);

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBooks = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    updatedAt,
    insertedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const someBooks = books;
      .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    const response = h.response({
      status: 'success',
      data: {
        books: someBooks,
      },
    });
    response.code(200);
    return response;
  }
  if (reading) {
    const thisBooks = books.filter((book) => book.reading === false);
    const response = h.response({
      status: 'success',
      data: {
        books: thisBooks.map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => Number(book.finished) === Number(finished)).map((buku) => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((buku) => ({
        id: buku.id,
        name: buku.name,
        publisher: buku.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const buku = books.filter((m) => m.id === bookId)[0];

  if (!buku) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      book:
        buku,
    },
  });
  response.code(200);
  return response;
};

const editOurBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((some) => some.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteOurBookHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((need) => need.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  saveBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editOurBookHandler,
  deleteOurBookHandler,
};
