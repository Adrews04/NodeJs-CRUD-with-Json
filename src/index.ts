import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { nanoid } from 'nanoid'

const app = express()
app.use(express.json())
const PORT = 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

const __dirname = import.meta.dirname

const filePath = path.join(__dirname, '../data/books.json')

/* try {
    const data = await fs.readFile(filePath, {
        encoding: 'utf8'
    });
    console.log(data);
} catch (err) {
    console.log(err);
} */

interface Book {
    id: string
    title: string
    price: number
}

const readFile = async () => { //Doesn't use directly try catch because it's gonna be called
    const data = await fs.readFile(filePath, { encoding: 'utf8' })
    const books = JSON.parse(data) //Transforms the data into a JavaScript object
    return books
}

const getBooks = async () => {
    try { // When the method is called it's when we use the try catch
        const books = await readFile()
        console.log(books)
    } catch (error) {
        console.log(error)
    }
}

const writeFile = async (books: Book[]) => {
    const json = JSON.stringify(books) //makes books an string so then we can use writeFile method
    await fs.writeFile(filePath, json)
}

const addBook = async (newBook: Book) => {
    try {
        const books = await readFile()
        books.push(newBook) //we make todos a book array so then we can use it in writeFile method
        await writeFile(books)
        console.log("Book added")
    } catch (error) {
        console.log(error)
    }
}

const deleteBook = async (id: string) => {
    try {
        const books = await readFile()
        const newBooks = books.filter(book => book.title !== id) //Filters so then the book with this id doesn't pass
        await writeFile(newBooks)

    } catch (error) {
        console.log(error)
    }
}

const updateBook = async (updatedBook: Book) => {
    try {
        const books = await readFile()
        const book = books.find((book) => book.id === updatedBook.id)

        if(!book){
            return console.log('Book not found 404')
        }

        const index = books.indexOf(book)
        const{ id, title, price} = updatedBook
        //books[index] = {...book, ...updatedBook} //"SPREAD OPERATOR" This function maintains the reppited info and changes the updated one
        books[index] = { id, title, price}
        await writeFile(books)
    } catch (error) {
        console.log(error)
    }
}

app.get('/', async (req, res) => {
    try {
        const books = await readFile()
        res.json(books)
    } catch (error) {
        console.log(error)
    }
})

app.post('/', async (req, res) => {
    try {
        const newBook = req.body
        await addBook(newBook)
        res.json(newBook)
    } catch (error) {
        console.log(error)
    }
})

app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await deleteBook(id)
        res.json({ message: 'Book deleted' })
    } catch (error) {
        console.log(error)
    }
})  

app.put('/:id', async (req, res) => {
    try {
        const updatedBook = req.body
        await updateBook(updatedBook)
        res.json(updatedBook)
    } catch (error) {
        console.log(error)
    }
})