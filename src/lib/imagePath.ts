export function posterPath(slug: string) {
  return `/characters/${slug}/poster.webp`
}

export function galleryPath(slug: string, n: number) {
  return `/characters/${slug}/g${n}.webp`
}
