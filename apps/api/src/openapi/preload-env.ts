// Должен импортироваться ПЕРВЫМ — до AppModule. ConfigModule.forRoot({ validate })
// проверяет окружение уже при импорте AppModule, поэтому фиктивный DATABASE_URL
// нужно выставить раньше. В preview-режиме реального подключения к БД нет.
process.env.DATABASE_URL ??= 'postgresql://preview:preview@localhost:5432/preview';
