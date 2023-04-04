export class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint).then(data => data.json()).then(({login, name, public_repos, followers}) => ({
            login, name, public_repos, followers
        }))
    }
}

export class Dados {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
        
        
    }

    async add(username){
        
        try{

            const userExists = this.entries.find(entry => username === entry.login)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)  
            if(user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }    
            
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error){
            alert(error.message)
        }
    }

    load(){
        const entries = JSON.parse(localStorage.getItem('@github-favorite:')) || []

        this.entries = entries
    }

    save(){
        localStorage.setItem('@github-favorite:', JSON.stringify(this.entries))
    }

    delete(user){
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FunctionView extends Dados{
    constructor(root){
        super(root)
        this.tbody = this.root.querySelector("table tbody")
        this.update()    
        this.onadd()    
    }

    onadd(){
        const fav = this.root.querySelector('.search button').onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update(){
        this.removeAllTr()
        this.entries.forEach(user => {            
            const tr = this.createRow()
            tr.querySelector('.content img').src = `https://github.com/${user.login}.png`
            tr.querySelector('.content p span').textContent = user.name
            tr.querySelector('a').textContent = user.login
            tr.querySelector('a').href = `https://github.com/${user.login}`
            tr.querySelector('.repositories').textContent = user.public_repos
            tr.querySelector('.followers').textContent = user.followers

            tr.querySelector('td button').onclick = () => {
                const deleteRow= confirm('Deseja deletar essa linha?')
                if(deleteRow){
                    this.delete(user)
                }
            }

            this.tbody.append(tr)
        })

    }

    createRow(){
        const row = document.createElement("tr")
        const content = `
        <td>
            <div class="content">
                <img src="https://github.com/arthurspk.png" alt="">
                <p><span>Arthur SPK</span>
                <a href="https://github.com/arthurspk" target="_blank">/arthurspk</a>
                </p>
            </div>
        </td>  
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td><button>Remover</button></td>  `

        row.innerHTML = content
        return row
    }

    removeAllTr(){
        this.tbody = this.root.querySelector("table tbody")
        this.tbody.querySelectorAll('tr').forEach(element => {
            element.remove()
        });
    }
}