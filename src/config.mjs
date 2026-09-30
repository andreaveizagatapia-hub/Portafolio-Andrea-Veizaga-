// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DEL SITIO
//  Todo lo que depende de datos externos está aquí.
//  Un enlace vacío ('') oculta su botón hasta que lo completes.
// ─────────────────────────────────────────────────────────────
export const site = {
  // Dominio final (sin barra al final). Se usa para canonical, Open Graph y sitemap.
  url: 'https://andreaveizaga.vercel.app',
  name: 'Andrea Veizaga',
  email: 'andreaveizaga.tapia@gmail.com',

  links: {
    linkedin: 'https://www.linkedin.com/in/andreaveizagatapia/',
    whatsapp: 'https://wa.me/59176989090',
    cv: 'cv/CV_Andrea_Veizaga_UXUI_designer.pdf', // archivo en /public/cv/
  },

  // Enlaces externos de cada caso de estudio
  projects: {
    pedidosya: { prototype: 'https://www.figma.com/proto/zFKHEq4tFD54aaNUIZ6lgp/Wireframes-PedidosYa?node-id=19-4&t=fDmaJmJo9gH0PXNj-1&scaling=scale-down&content-scaling=fixed&page-id=19%3A2&starting-point-node-id=19%3A4' },
    prime: {
      prototype: 'https://www.figma.com/proto/lvoIMgHVASXtJpciWqd8hJ/Prototipo-Alta-Prime-Cinemas?node-id=23-79&t=IXL5OeF516TPthi4-1&scaling=scale-down&content-scaling=fixed&page-id=18%3A76&starting-point-node-id=23%3A79',
      designSystem: 'https://www.figma.com/design/Vil6Mv16mFTYDlv9vY1aXP/Design-System-Prime-Cinemas?node-id=0-1&t=n1FY7UAazglDGDpZ-1',
    },
    rico: { prototype: 'https://www.figma.com/design/27rGBCHzW1mBki335EYAm6/Wireframes-Rico?node-id=1-2&t=n1FY7UAazglDGDpZ-1' },
    nestart: {
      prototype: 'https://www.figma.com/proto/8lCLHOowQ3NIRrQKhuzx1t/Prototipo-en-Alta-Fidelidad-nestart?node-id=93-3748&t=oiVqwqvUZIhhtuMD-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=93%3A3748',
      userflow: 'https://www.figma.com/board/9fUHYiYif4YdnPZxHNO013/Userflow-nestart?node-id=0-1&t=n1FY7UAazglDGDpZ-1',
    },
  },
};
