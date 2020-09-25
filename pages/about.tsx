import Link from 'next/link'
import { Heading } from '@chakra-ui/core'
import Layout from 'components/Layout'

const AboutPage = () => (
  <Layout title='About | Next.js + TypeScript Example'>
    <Heading>About</Heading>
    <p>This is the about page</p>
    <p>
      <Link href='/'>
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export default AboutPage
