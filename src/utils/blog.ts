import sddPost from '../data/blog/portfolio-site-sdd.json';

export interface BlogPost {
  id: string;
  title: string;
  date: Date;
  excerpt: string;
  slug: string;
  lang: 'es' | 'en';
  isStatic: boolean;
}

export function getStaticPosts(): BlogPost[] {
  return [
    {
      id: sddPost.id,
      title: sddPost.titleEs,
      date: new Date(sddPost.date),
      excerpt: 'Un recorrido práctico por el proceso de construir este site usando Spec Driven Development',
      slug: sddPost.id,
      lang: 'es',
      isStatic: true,
    },
    {
      id: sddPost.id,
      title: sddPost.titleEn,
      date: new Date(sddPost.date),
      excerpt: 'A practical walkthrough of building this site using Spec Driven Development',
      slug: sddPost.id,
      lang: 'en',
      isStatic: true,
    },
  ];
}

export function getAllPosts(staticPosts: BlogPost[]) {
  return staticPosts.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
