(function () {
    const config = window.APP_CONFIG;
    const supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const isProtectedPage = window.location.pathname === '/protected.html';

    async function redirectForSession() {
        const { data } = await supabase.auth.getSession();
        if (isProtectedPage && !data.session) {
            window.location.replace('/');
        } else if (!isProtectedPage && data.session) {
            window.location.replace('/protected.html');
        }
    }

    supabase.auth.onAuthStateChange((_event, session) => {
        if (isProtectedPage && !session) {
            window.location.replace('/');
        }
    });

    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const message = document.querySelector('#login-message');
            const email = loginForm.email.value.trim();
            const password = loginForm.password.value;
            if (!email || !password) {
                message.textContent = 'Informe e-mail e senha.';
                return;
            }

            message.textContent = 'Entrando...';
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                message.textContent = 'Não foi possível entrar. Verifique suas credenciais.';
                return;
            }
            window.location.replace('/protected.html');
        });
    }

    const logoutButton = document.querySelector('#logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                document.querySelector('#page-message').textContent = 'Não foi possível sair. Tente novamente.';
                return;
            }
            window.location.replace('/');
        });
    }

    async function loadStudents() {
        if (!window.apiClient) return;
        const message = document.querySelector('#page-message');
        const list = document.querySelector('#student-list');
        try {
            const students = await window.apiClient.request('/api/alunos');
            list.replaceChildren(...students.map((student) => {
                const item = document.createElement('li');
                const details = document.createElement('span');
                details.textContent = `${student.nome} - ${student.escola}`;
                const removeButton = document.createElement('button');
                removeButton.className = 'danger';
                removeButton.type = 'button';
                removeButton.textContent = 'Remover';
                removeButton.addEventListener('click', () => removeStudent(student.id));
                const editButton = document.createElement('button');
                editButton.className = 'secondary';
                editButton.type = 'button';
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => startEditing(student));
                item.append(details, editButton, removeButton);
                return item;
            }));
            message.textContent = students.length ? '' : 'Nenhum aluno cadastrado.';
        } catch (error) {
            message.textContent = error.message;
        }
    }

    function startEditing(student) {
        const form = document.querySelector('#student-form');
        Object.keys(student).forEach((field) => {
            if (form.elements[field]) form.elements[field].value = student[field] ?? '';
        });
        form.dataset.editingId = student.id;
        document.querySelector('#form-title').textContent = 'Editar aluno';
        form.querySelector('button[type="submit"]').textContent = 'Salvar alterações';
        document.querySelector('#cancel-edit-button').hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function cancelEditing() {
        const form = document.querySelector('#student-form');
        delete form.dataset.editingId;
        form.reset();
        document.querySelector('#form-title').textContent = 'Cadastrar aluno';
        form.querySelector('button[type="submit"]').textContent = 'Cadastrar aluno';
        document.querySelector('#cancel-edit-button').hidden = true;
    }

    async function removeStudent(studentId) {
        if (!window.confirm('Deseja remover este aluno?')) return;

        const message = document.querySelector('#page-message');
        try {
            await window.apiClient.request(`/api/alunos/${encodeURIComponent(studentId)}`, {
                method: 'DELETE'
            });
            message.textContent = 'Aluno removido com sucesso.';
            await loadStudents();
        } catch (error) {
            message.textContent = error.message;
        }
    }

    const refreshButton = document.querySelector('#refresh-button');
    if (refreshButton) refreshButton.addEventListener('click', loadStudents);

    const studentForm = document.querySelector('#student-form');
    if (studentForm) {
        document.querySelector('#cancel-edit-button').addEventListener('click', cancelEditing);
        studentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const payload = Object.fromEntries(new FormData(studentForm));
            payload.valor = Number(payload.valor);
            payload.vencimento = Number(payload.vencimento);
            try {
                const editingId = studentForm.dataset.editingId;
                await window.apiClient.request(editingId ? `/api/alunos/${encodeURIComponent(editingId)}` : '/api/alunos', {
                    method: editingId ? 'PUT' : 'POST',
                    body: JSON.stringify(payload)
                });
                cancelEditing();
                await loadStudents();
            } catch (error) {
                document.querySelector('#page-message').textContent = error.message;
            }
        });
    }

    redirectForSession().then(() => {
        if (isProtectedPage) loadStudents();
    });
})();
