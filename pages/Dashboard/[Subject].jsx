import React from 'react'
import { useRouter } from "next/router";

const Subject = () => {
  const router = useRouter()
  const { Subject } = router.query;
  return (
    <div>Subject : {Subject}</div>
  )
}

export default Subject