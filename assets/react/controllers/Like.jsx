import React from 'react'
import { useState } from 'react';
import styles from "/assets/styles/Like.module.css?module";

export default function Like({ props }) {
  const [isLiked, setIsLiked] = useState(props.isLikedByUser);
  const [likes, setLikes] = useState(props.likes)
  
  const handleLike = async () => {
    if (props.user){
      
      setIsLiked(!isLiked);

      const response = await fetch(`/like/artwork/${props.sceneId}/${props.entity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: props.userId }),
      });
  
      const data = await response.json();
       // Update the like count
      if (data.message === 'Like successfully added.') {
        setLikes(likes + 1);
      } else if (data.message === 'Like successfully deleted.') {
        setLikes(likes - 1);
      }
    }
  };

  return (
    <div className={`${styles.likeBox}`}>
      {isLiked? (
        <svg onClick={handleLike} xmlns="http://www.w3.org/2000/svg" className={`${styles.likedSvg}`} viewBox="0 0 20 20" fill="white">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
        </svg>
      ) : (
        <svg onClick={handleLike} xmlns="http://www.w3.org/2000/svg" className={`${styles.unlikedSvg}`} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
        </svg>
      )}
    
      <span className={`${styles.numLikes}`}>{likes} like{ likes<=1 ?  '' : 's' }</span>

  </div>
  )
}
