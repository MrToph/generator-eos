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
            { globOptions: { dot: true } },
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
