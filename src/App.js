import { useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';

import useBookSearch from './useBookSearch';
function App() {
  const [query, setQuery]= useState('')
  const [pageNumber, setPageNumber]= useState(1)

  // к вызову добавляем state - деструктурируем объект
  const {books, hasMore,loading,error } = useBookSearch(query, pageNumber)
const observer = useRef() // для  поиска
// для последнего видимого элемента  на странице при скроле вниз - чтобы знать когда подгружать новые данные  - нужен хук useCallback 

const lastBookElementRef = useCallback( node => {
 // console.log(node); //  увидим последний элемент внизу страницы <div>Z-Test-4</div>
if(loading) return // если идет загрузка не подгружаем новое
if(observer.current) observer.current.disconnect()

observer.current = new IntersectionObserver ( entries => {
  if(entries[0].isIntersecting && hasMore) {
    // сработает при прокрутки в самый низ и тогда добавляем новую страницу
    setPageNumber(prevPageNumber =>  prevPageNumber +1)
  }
})
if(node) observer.current.observe(node)
},[loading, hasMore])

// обрабатываем запрос из поля
  function handleSearch(e) { 
    setQuery(e.target.value)
    // каждая страница в json по 100 элементов = 10 страница стартует с 900 - start: 900,
    setPageNumber(2) 
  }
 return (
  <> 
<div className="header-wrapper">
<div className="header">Введите в строку поиска любое название книги или автора (на латинице). <br /> После скролла в самый низ подгрузится БД с следущими данными</div>
<input className={'input'} 
   value={query}
   onChange={handleSearch}
   type="text" />
</div>
<div className="content-wrapper">

  {
    books.map((book, index) => {
      // если еще есть текст то применяем ref
      if( books.length === index +1) {
       return  <div className={'content'}  ref={lastBookElementRef} key={index}>{book}</div>
      }  else {
        // если нет больше текста
          return  <div key={index}>{book}</div>
      }
      })  
  }
  {/* эти div будут показывать процесс загрузки  или ошибку */}
   <div>{loading && 'Loading...'}</div>
   <div>{error && 'Error'}</div>
</div>

  </>
  );
}
export default App;
