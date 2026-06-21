export const metadata = {
  title: 'PromptMart',
  description: 'Библиотека ИИ-промптов',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
