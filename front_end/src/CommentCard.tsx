import React from 'react'
import { Comment } from './App'

type Props = {
    comment: Comment
}

const CommentCard: React.FC<Props> = ({comment}) => {
  return (
    <div className='flex flex-col w-full max-w-5xl bg-gray-400 my-3 rounded-md p-3 '>
        <div className='flex gap-3'>
            <p><strong>{comment.name}</strong></p>
            <p>{comment.time}</p>
        </div>
        <p>{comment.content}</p>
    </div>
  )
}

export default CommentCard