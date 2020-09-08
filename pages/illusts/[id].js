import {replaceSmallImg} from '../../utils'
import Link from "next/link";
import Head from "next/head";

export default function Post({illustDetail, relateIllustList}) {

    return <div>
        <Head>
            <title>Pixivic</title>
            <meta property="og:title" content={illustDetail.title} key="title" />
            <meta property="og:description" content={illustDetail.caption} key="description" />
        </Head>
        <main>
            <img style={{height: '200px', width: '200px'}} title={illustDetail.title} alt={illustDetail.caption}
                 src={illustDetail.src}/>
            <h1>{illustDetail.title}</h1>
            <h2>{illustDetail.artistPreView.name}</h2>
            <span>{illustDetail.caption}</span>
            <ul>
                {illustDetail.tags.map(e => (<li key={e.id}>
                    <span>{e.translatedName}</span>
                    <span>{e.name}</span>
                </li>))}
            </ul>
        </main>
        <div>
            <ul>{relateIllustList.map(i => (<li key={i.id}>
                <img style={{height: '200px', width: '200px'}} title={i.title} alt={i.caption}
                     src={i.src}/>
                <Link key={i.id} href={`/illusts/${i.id}`}>{i.title}</Link>
                <span>{i.artistPreView.name}</span>
                <span>{i.caption}</span>
                <ul>
                    {i.tags.map(e => (<li key={e.id}>
                        <span>{e.translatedName}</span>
                        <span>{e.name}</span>
                    </li>))}
                </ul>
            </li>))}</ul>
        </div>
    </div>
}


export const getServerSideProps = async (content) => {
    const url = `${process.env.BASE_API}/admin/illusts/${content.query.id}`
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {Token: '55673d83-a269-45b4-954f-59c731ddb8f0'}
    }).then(e => e.json())
    const illustDetail = await res.data
    illustDetail.src = replaceSmallImg(illustDetail.imageUrls[0].medium)
    let relateIllustList = []
    for (let i = 1; i < 3; i++) {
        const url = `${process.env.BASE_API}/illusts/${content.query.id}/related/?pageSize=30&page=${i}`
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {Token: '55673d83-a269-45b4-954f-59c731ddb8f0'}
        }).then(e => e.json())
        if (res.data && res.data.length) {
            relateIllustList = relateIllustList.concat(res.data)
        } else {
            break
        }
    }
    relateIllustList.forEach((item) => {
        item.src = replaceSmallImg(item.imageUrls[0].medium)
    })
    return {
        props: {
            illustDetail,
            relateIllustList
        },
    }
}
