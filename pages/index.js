import dayjs from "dayjs";
import {toQueryString,replaceSmallImg}  from '../utils'
import Link from 'next/link'

export default function Home({posts}) {

  return (
      <div class="container">
        <h1>pixivic 插画网站</h1>
        <ul class="picture-grid">
          {posts.map(item=>(
            <li>
              <img title={item.title} alt={item.caption}   src={item.src} />
            <span>{ item.artistPreView.name }</span>
            <Link href={`/illusts/${item.id}`}>{ item.title }</Link>
            <div class="caption">{ item.caption }</div>
            <ul class="tags">
              {item.tags.map(e=>(<li>{e.name}</li>))}
          </ul>
            </li>
          ))}

</ul>
</div>
  )
}
export const getStaticProps = async () => {
  const params ={
    page: 1,
    pageSize: 200,
    date: dayjs(new Date()).add(-2, 'days').format('YYYY-MM-DD'),
    mode: 'day',
  }
  const str =toQueryString(params)
  const url =`${process.env.BASE_API}/ranks${str}`
  const res = await fetch(url,{method:'GET',credentials:'include'}).then(e=>e.json())
  const posts  = await res.data ||[]
  posts.forEach((item) => {
    item.src = replaceSmallImg(item.imageUrls[0].medium)
  })
  return {
    props: {
      posts
    },
  }
}
