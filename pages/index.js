import dayjs from "dayjs";
import {toQueryString, replaceSmallImg} from '../utils'
import Head from 'next/head'
import Link from 'next/link'

export default function Home({posts}) {

    return (
        <div>
            <Head>
                <title>Pixivic</title>
                <meta property="og:title" content="Pixivic" key="title" />
                <meta property="og:description" content="提供Pixiv插画排行榜的浏览与下载以及热门排序的高级会员搜索" key="description" />
            </Head>
            <h1>pixivic 插画网站</h1>
            <ul>
                {posts.map(item => (
                    <li key={item.id}>
                        <img title={item.title} alt={item.caption} src={item.src}/>
                        <span>{item.artistPreView.name}</span>
                        <Link href={`/illusts/${item.id}`}>{item.title}</Link>
                        <div>{item.caption}</div>
                        <ul>
                            {item.tags.map(e => (<li key={e.name}>{e.name}</li>))}
                        </ul>
                    </li>
                ))}

            </ul>
        </div>
    )
}
export const getStaticProps = async () => {
    const params = {
        page: 1,
        pageSize: 200,
        date: dayjs(new Date()).add(-2, 'days').format('YYYY-MM-DD'),
        mode: 'day',
    }
    const str = toQueryString(params)
    const url = `${process.env.BASE_API}/ranks${str}`
    const res = await fetch(url, {method: 'GET', credentials: 'include'}).then(e => e.json())
    const posts = await res.data || []
    posts.forEach((item) => {
        item.src = replaceSmallImg(item.imageUrls[0].medium)
    })
    return {
        props: {
            posts
        },
    }
}
