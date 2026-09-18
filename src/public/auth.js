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
            populateStudentSelectors(students);
            message.textContent = students.length ? '' : 'Nenhum aluno cadastrado.';
        } catch (error) {
            message.textContent = error.message;
        }

        function populateStudentSelectors(students) {
            const selectors = [
                document.querySelector('#charge-student'),
                document.querySelector('#finance-student-filter')
            ];
            selectors.forEach((select) => {
                if (!select) return;
                const selected = select.value;
                const emptyLabel = select.id === 'charge-student' ? 'Selecione um aluno' : 'Todos os alunos';
                select.replaceChildren(new Option(emptyLabel, ''));
                students.forEach((student) => {
                    select.append(new Option(`${student.nome} - ${student.escola}`, student.id));
                });
                select.value = selected;
            });
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

    function financeQuery() {
        const params = new URLSearchParams();
        const studentId = document.querySelector('#finance-student-filter')?.value;
        const competence = document.querySelector('#finance-competence-filter')?.value;
        const status = document.querySelector('#finance-status-filter')?.value;
        if (studentId) params.set('aluno_id', studentId);
        if (competence) params.set('competencia', competence);
        if (status) params.set('status', status);
        const query = params.toString();
        return query ? `/api/mensalidades?${query}` : '/api/mensalidades';
    }

    function formatMoney(value) {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function renderCharges(charges) {
        const list = document.querySelector('#charge-list');
        const message = document.querySelector('#finance-message');
        if (!list || !message) return;
        list.replaceChildren(...charges.map((charge) => {
            const item = document.createElement('li');
            const header = document.createElement('div');
            header.className = 'charge-header';
            const title = document.createElement('strong');
            title.textContent = `${charge.aluno_nome} - ${charge.competencia.slice(0, 7)}`;
            const status = document.createElement('span');
            status.className = `status status-${charge.status.toLowerCase()}`;
            status.textContent = charge.status;
            header.append(title, status);
            const details = document.createElement('span');
            details.textContent = `${formatMoney(charge.valor)} | Vencimento: dia ${charge.dia_vencimento}`;
            item.append(header, details);
            if (charge.status === 'Pago') {
                const payment = document.createElement('span');
                payment.textContent = `Pago em ${charge.data_pagamento} por ${formatMoney(charge.valor_pago)}${charge.pago_em_atraso ? ' (em atraso)' : ''}.`;
                item.append(payment);
            } else {
                const form = document.createElement('form');
                form.className = 'payment-form';
                form.innerHTML = `
                    <label>Data do pagamento<input name="data_pagamento" type="date" max="${new Date().toISOString().slice(0, 10)}" required></label>
                    <label>Valor recebido<input name="valor_pago" type="number" min="${charge.valor}" step="0.01" value="${charge.valor}" required></label>
                    <button type="submit">Marcar como pago</button>
                `;
                form.addEventListener('submit', (event) => payCharge(event, charge));
                item.append(form);
            }
            return item;
        }));
        message.textContent = charges.length ? '' : 'Nenhuma mensalidade encontrada.';
    }

    async function loadCharges() {
        const message = document.querySelector('#finance-message');
        if (!message || !window.apiClient) return;
        message.textContent = 'Carregando mensalidades...';
        try {
            const charges = await window.apiClient.request(financeQuery());
            renderCharges(charges);
        } catch (error) {
            message.textContent = error.message;
        }
    }

    async function payCharge(event, charge) {
        event.preventDefault();
        const form = event.currentTarget;
        const message = document.querySelector('#finance-message');
        const payload = Object.fromEntries(new FormData(form));
        payload.valor_pago = Number(payload.valor_pago);
        try {
            await window.apiClient.request(`/api/mensalidades/${encodeURIComponent(charge.id)}/pagamento`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            message.textContent = 'Pagamento registrado com sucesso.';
            await loadCharges();
        } catch (error) {
            message.textContent = error.message;
        }
    }

    const chargeForm = document.querySelector('#charge-form');
    if (chargeForm) {
        chargeForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const message = document.querySelector('#finance-message');
            const payload = Object.fromEntries(new FormData(chargeForm));
            payload.valor = Number(payload.valor);
            payload.dia_vencimento = Number(payload.dia_vencimento);
            try {
                await window.apiClient.request('/api/mensalidades', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                chargeForm.reset();
                message.textContent = 'Mensalidade registrada com sucesso.';
                await loadCharges();
            } catch (error) {
                message.textContent = error.message;
            }
        });
    }

    ['#finance-refresh-button', '#finance-student-filter', '#finance-competence-filter', '#finance-status-filter']
        .forEach((selector) => {
            const element = document.querySelector(selector);
            if (element) element.addEventListener('change', loadCharges);
        });
    const financeRefresh = document.querySelector('#finance-refresh-button');
    if (financeRefresh) financeRefresh.addEventListener('click', loadCharges);

    redirectForSession().then(() => {
        if (isProtectedPage) {
            loadStudents();
            loadCharges();
        }
    });
})();
