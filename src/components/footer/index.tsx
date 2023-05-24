import blogConfig from 'blog-config';

function Footer() {
  return (
    <footer>
    © {blogConfig.name}, Built with NextJS, 2023
    </footer>
  );
}

export default Footer;