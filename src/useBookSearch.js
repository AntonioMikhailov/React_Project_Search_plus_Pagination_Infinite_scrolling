import  { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react';

//  Это кастомный Хук
//  В параметры будет получать текст запроса- query, какая страница - pageNumber - чтобы было понятно ( для API) какая должна быть присоединена ниже
export default function useBookSearch(query, pageNumber) {

  const [ loading, setLoading] = useState(true)
  const [ error, setError] = useState(false)
  const [ books, setBooks] = useState([])
  const [ hasMore, setHasMore] = useState(false) // когда весь текст закончится 
// Еще один эффект чтобы очищал предыдущий поиск на странице при вводе нового запроса
useEffect(()=> {
  setBooks([]) // при каждом запросе очищаем результат на странице
}, [query])

useEffect(()=> {
  setLoading(true)
  setError(false)
  let cancel;
  //  axios для получения данных
  axios({
   method: 'GET',
  url: 'http://openlibrary.org/search.json',
  params : { q: query, page: pageNumber}, // объект с параметрами

  // чтобы не посылать запросы после каждого ввода символа  а ждать когда будет введено все слово
cancelToken: new axios.CancelToken((c)=> {
cancel = c
})
  }).then( res=> {
    setBooks(prevBooks => {
      // используем new Set - который возвращает только уникальные пары  ключ-значение
      // Будем получать title книг - 
      // чтобы получать на новой строке каждый Заголовок делаем spread ... - ...res.data.docs.map 
      return  [...new Set([...prevBooks, ...res.data.docs.map(item => item.title)])] // ПОЛУЧАЕМ именно Заголовки или можно author_name

    })
    setHasMore(res.data.docs.length > 0) // проверяем что еще есть текст
    setLoading(false)
    // Ответ на Поиск
   // console.log(res.data); // {numFound: 133283, start: 0, numFoundExact: true, docs: Array(100), num_found: 133283, …}
  }).catch(e => {
    if( axios.isCancel(e)) return  // говорим чтобы игнорировал отмену
    setError(true)
  })
return ()=> cancel()

}, [query, pageNumber]) // срабатывать будет только на изменении этих параметров
 
// возвращаем все state
  return {loading, error, books, hasMore  }
}
