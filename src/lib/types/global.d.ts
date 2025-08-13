export interface User {
  id: string
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  createdAt: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface DisplayUser {
  id: string
  name: string
  email: string
  address: string
}

interface UserData {
  id: string | number
  name: string
}

interface Comment {
  id: number
  body: string
  author: CommentAuthor
  created: string
  upvoted: boolean
  downvoted: boolean
  commented: boolean
  upvotes: number
  downvotes: number
  comments: number
  replies: Comment[]
}
