// Seleciona os elementos
const form = document.querySelector("form")
const inputDespesa = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

// Nao autoriza o usuario colocar letras
inputDespesa.addEventListener("input", () => {
    let value = inputDespesa.value.replace(/\D+/g, '')

    // Transformar o valor em centavos
    value = Number(value) / 100

    // Obtem o valor atual, e remove os caracteres nao numericos e mostra sem esses valores
    inputDespesa.value = formatCurrencyBRL(value)
})

function formatCurrencyBRL(value) {
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

    return value
}

// Captura o evento de envio do formulario

form.onsubmit = (event) => {
    // Previne o comportamento padrao de recarregar a pagina
    event.preventDefault()

    // Cria um objeto com os detalhes da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: inputDespesa.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
    try {
        // Cria o elemento para adicionar na lista
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o icone
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense
        expenseInfo.append(expenseName)

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name
        expenseInfo.append(expenseCategory)

        // Cria o valor da despesa 
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        // Cria o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute('src', 'img/remove.svg')
        removeIcon.setAttribute('alt', 'remover')


        // Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // Adiciona o item na lista
        expenseList.append(expenseItem)

        // Limpa os dados 
        clear()
        // Atualiza os totais
        updateTotals()

    } catch (error) {
        alert("Nao foi possivel atualizar a lista de despesa")
        console.log(error)
    }
}

// Atualiza os totais
function updateTotals() {
    try {
        // Recupera todos os itens (li) da lista
        const itens = expenseList.children

        // Atualiza a quantidade de itens na lista
        expenseQuantity.textContent = `${itens.length} ${
            itens.length > 1 ? "despesas" : "despesa"
        }`

        // Variavel para incrementar o total
        let total = 0

        // Percorre cada item da li da lista ul
        for (let item = 0; item < itens.length; item++) {
            const itemAmount = itens[item].querySelector(".expense-amount")

            // Remove caracteres nao numericos e coloca . no lugar da ,
            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(",",".")

            // Transforma em float
            value = parseFloat(value)

            // Verifica se é um numero valido
            if (isNaN(value)) {
                alert("Não foi possivel calcular o total. O valor não parece ser um numero")
            }

            // Incrementa o valor total
            total += Number(value)

        }

        // Cria span para adicionar o R$ formatado
        const symbol = document.createElement("small")
        symbol.textContent = "R$"
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        expenseTotal.innerHTML = ''

        expenseTotal.append(symbol, total)
    } catch(error) {
        alert("Nao foi possivel atualizar o total")
        console.log(error)
    }
}

// Evento que captura clique nos itens da lista
expenseList.addEventListener('click', (event) => {
    // Verifica se o elemento clicado é o icone
    if(event.target.classList.contains('remove-icon')) {
        // Obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")
        item.remove()

        expense.focus()
    }

    updateTotals()
})

// Limpa os inputs para digitarmos um novo valor
function clear() {
    expense.value = ''
    category.value = ''
    amount.value = ''

    expense.focus()
}