const path = require(`path`)
const Generator = require(`yeoman-generator`)
const kebabCase = require(`lodash.kebabcase`)
const camelCase = require(`lodash.camelcase`)
const userName = require(`git-user-name`)

module.exports = class extends Generator {
    initializing() {
        this.fullName = userName() // read git config
    }
    async prompting() {
        const prompts = [
            {
                type: `input`,
                name: `moduleName`,
                message: `Name of your module`,
            },
            {
                type: `input`,
                name: `contractAccount`,
                message: `Contract Account Name`,
                validate: (input) => new RegExp('^[a-z][a-z1-5\.]{0,10}([a-z1-5]|^\.)[a-j1-5]?$').test(input) || "Contract name must only contain characters a-z 1-5 and . no greater than 13 in length."
            },
        ]
        if (!this.fullName)
            prompts.push({
                type: `input`,
                name: `fullName`,
                message: `First Name Last Name`,
            })
        this.answers = await this.prompt(prompts)
        this.moduleNameCamelCased = camelCase(this.answers.moduleName)
        this.moduleNameKebabCased = kebabCase(this.answers.moduleName)
    }

    writing() {
        const { contractAccount, moduleName } = this.answers
        const { moduleNameCamelCased, moduleNameKebabCased } = this
        const fullName = this.fullName || this.answers.fullName

        // copy everything and then rename parts of it
        this.destinationRoot(path.join(this.destinationRoot(), moduleNameKebabCased))
        console.log(this.templatePath(), this.destinationPath())

        // copy interpreting ejs templates in files
        this.fs.copyTpl(
            this.templatePath(),
            this.destinationPath(),
            {
                contractAccount,
                moduleName,
                moduleNameCamelCased,
                moduleNameKebabCased,
                fullName,
            },
            undefined,
            { globOptions: { dot: true, ignore: [`**/*.template.js`] } },
        )

        // copy without interpreting ejs templates in files
        this.fs.copy(
            this.templatePath(`scripts/create_actions/action.template.js`),
            this.destinationPath(`scripts/create_actions/action.template.js`),
        )

        const mv = (from, to) => {
            this.fs.move(this.destinationPath(from), this.destinationPath(to))
        }
        mv(`_gitignore`, `.gitignore`)
        mv(`_package.json`, `package.json`)
        mv(`contract/CONTRACT_rc.md`, `contract/${moduleNameCamelCased}_rc.md`)
        mv(`contract/CONTRACT.cpp`, `contract/${moduleNameCamelCased}.cpp`)
        mv(`contract/CONTRACT.hpp`, `contract/${moduleNameCamelCased}.hpp`)
        mv(`contract/CONTRACT.init_rc.md`, `contract/${moduleNameCamelCased}.init_rc.md`)
    }

    end() {
        this.spawnCommand(`git`, [`init`])
        this.npmInstall()
    }
}
