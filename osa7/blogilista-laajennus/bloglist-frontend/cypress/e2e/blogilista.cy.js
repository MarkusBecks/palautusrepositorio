describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'make',
      username: 'make',
      password: 'make',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.contains('login')
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('make')
      cy.get('#password').type('make')
      cy.get('#login-button').click()

      cy.contains('make logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('wrong')
      cy.get('#password').type('creds')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'make', password: 'make' })
    })

    it('Blogs are sorted by likes', function () {
      // create 3 blogs
      cy.createBlog({
        title: 'Blog with the most likes',
        author: 'Test Author',
        url: 'testurl',
      })
      cy.createBlog({
        title: 'Blog with the second most likes',
        author: 'Test Author',
        url: 'testurl',
      })
      cy.createBlog({
        title: 'Blog with the least likes',
        author: 'Test Author',
        url: 'testurl',
      })
      // view all the blogs to gain access to like button
      cy.get('.viewButton').contains('view').click()
      cy.get('.viewButton').contains('view').click()
      cy.get('.viewButton').contains('view').click()
      // click like buttons
      cy.contains('Blog with the most likes')
        .parent()
        .find('.likesButton')
        .click()
        .click()
        .click()
      cy.contains('Blog with the second most likes')
        .parent()
        .find('.likesButton')
        .click()
        .click()
      cy.contains('Blog with the least likes')
        .parent()
        .find('.likesButton')
        .click()

      cy.get('.blog').eq(0).should('contain', 'Blog with the most likes')
      cy.get('.blog').eq(1).should('contain', 'Blog with the second most likes')
      cy.get('.blog').eq(2).should('contain', 'Blog with the least likes')
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('testAuthor')
      cy.get('#url').type('cypress.cy')
      cy.get('#create').click()
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a blog created by cypress',
          author: 'testAuthor',
          url: 'cypress.cy',
        })
      })

      it('it can be liked', function () {
        cy.contains('a blog created by cypress').contains('view').click()

        cy.contains('like').click()

        cy.contains('likes 1')
      })
      it('it can be deleted by its creator', function () {
        cy.contains('a blog created by cypress').contains('view').click()

        cy.contains('remove blog').click()

        cy.contains('Blog a blog created by cypress by testAuthor deleted.')
      })
      it('it can not be deleted by another user', function () {
        cy.contains('logout').click()

        const user = {
          name: 'unauthorized user',
          username: 'userman',
          password: 'hunter1234',
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)

        cy.login({ username: 'userman', password: 'hunter1234' })

        cy.contains('a blog created by cypress').contains('view').click()

        cy.contains('Added by make')
        cy.contains('remove blog').should('not.exist')
      })
    })
  })
})
