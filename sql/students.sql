CREATE TABLE IF NOT EXISTS subjects(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,

    name TEXT NOT NULL CHECK (name <> '') UNIQUE,
    level INTEGER NOT NULL CHECK (level > 0),
    prerequisites INTEGER ARRAY NOT NULL,
    corequisites INTEGER ARRAY NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0)
);

// Modify name column to be UNIQUE
ALTER TABLE subjects
    ADD CONSTRAINT subjects_name_key UNIQUE (name);

CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    document INTEGER NOT NULL CHECK (document > 0) UNIQUE,

    name TEXT NOT NULL CHECK (name <> ''),
    lastname TEXT NOT NULL CHECK (lastname <> ''),
    email TEXT NOT NULL CHECK (email <> '') UNIQUE,
    phone TEXT NOT NULL CHECK (phone <> ''),

    semester INTEGER NOT NULL CHECK (semester > 0) DEFAULT 1,
    complete_subjects JSON NOT NULL DEFAULT '[]'::JSON,
    current_subjects JSON NOT NULL DEFAULT '[]'::JSON,
    active BOOLEAN NOT NULL DEFAULT true,

    created_at DATE DEFAULT CURRENT_DATE,
    updated_at DATE DEFAULT CURRENT_DATE
);

INSERT INTO subjects(name, level, prerequisites, corequisites, credits)
    VALUES  ('Informatica I', 1, '{}', '{}', 3),
            ('Algebra y Trigonometria', 1, '{}', '{}', 3),
            ('Geometria Vectorial y Analitica', 1, '{}', '{}', 3),
            ('Calculo Diferencial', 1, '{}', '{2}', 3),
            ('Descubriendo la Fisica', 1, '{}', '{}', 3),
            ('Ingles I', 1, '{}', '{}', 1),

            ('Informatica II', 2, '{1}', '{}', 3),
            ('Calculo Integral', 2, '{1}', '{}', 3),
            ('Algebra Lineal', 2, '{2, 3}', '{}', 3),
            ('Fisica Mecanica', 2, '{5}', '{}', 3),
            ('Ingles II', 2, '{6}', '{}', 1),

            ('Ecuaciones Diferenciales', 3, '{4, 5}', '{8}', 3),
            ('Calculo Vectorial', 3, '{8, 9}', '{}', 3),
            ('Fisica de Ondas', 3, '{10}', '{}', 3),
            ('Fisica de Campos', 4, '{10}', '{}', 3),
            ('Circuitos Electricos I', 3, '{10}', '{}', 3),
            ('Ingles III', 3, '{11}', '{}', 1),

            ('Matematicas Especiales', 4, '{}', '{}', 3),
            ('Fisica de Estado Solido y Moderna', 4, '{}', '{}', 3),
            ('Electromagnetismo', 4, '{}', '{}', 3),
            ('Circuitos Electricos II', 4, '{13}', '{}', 3),
            ('Senales Digitales I', 4, '{13}', '{}', 3),
            ('Ingles IV', 4, '{15}', '{}', 1);

/*
INSERT INTO students(name, surname, email, phone, semester, complete_curses, current_curses, active)
    VALUES  ('Juan', 'Perez', 'juan.perez1@udea.edu.co', '1234567890', 1, 
            '{}', 
            '{"1": [3, 3.5], "2": [3.7, 3.2]}', 
            true),

            ('Pedro', 'Perez', 'pedro.perez1@udea.edu.co', '1234567890', 2, 
            '{"1": [2.5, 3.0, 3.5, 3.0, 3.5], "2": [3.4, 2.3, 3.0, 2.0, 4.2], "3": [3.5, 3.5, 3.5, 3.5]}', 
            '{"4": [2.3, 2.8], "5": [4.7, 4.2]}', 
            true),

            ('Maria', 'Perez', 'maria.perez@udea.edu.co', '1234567890', 1, 
            '{"1": [4.3, 4.4, 3.8, 4.8, 5.0], "2": [4.8, 5.0, 4.5, 5.0, 5.0], "3": [4.5, 4.5, 4.5, 4.5, 4.5]}', 
            '[]'::JSON, 
            false);
*/