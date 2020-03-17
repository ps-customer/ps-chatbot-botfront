/* global cy Cypress:true */

const findGroupAndOpenIfClosed = (groupName, saveToAlias = 'alias') => {
    cy.dataCy('story-group-menu-item', groupName).should('exist')
        .findCy('toggle-expansion-story-group').as(saveToAlias)
        .then((item) => {
            if (item.hasClass('right')) cy.wrap(item).click({ force: true });
        })
        .should('have.class', 'down');
};

const findStoryAndSelect = (storyName, saveToAlias = 'alias') => {
    cy.dataCy('story-group-menu-item', storyName, '[type="story"]')
        .first().as(saveToAlias)
        .click();
};

const renameStoryOrGroup = (alias, newName) => {
    cy.get(`@${alias}`).find('.item-name').dblclick({ force: true });
    cy.get(`@${alias}`).find('input').type(`{selectAll}{backSpace}{selectAll}{backSpace}${newName}{enter}`);
};

Cypress.Commands.add('browseToStory', (storyName = 'Groupo (1)', groupName) => {
    if (groupName) findGroupAndOpenIfClosed(groupName);
    findStoryAndSelect(storyName);
});

Cypress.Commands.add('linkStory', (storyName, linkTo) => {
    cy.dataCy('story-title').should('exist').then((title) => {
        if (title.attr('value') !== storyName) cy.browseToStory(storyName); // or .text()
    });
    cy.dataCy('stories-linker')
        .first().click();
    cy.dataCy('stories-linker')
        .find(`div.item:contains(${linkTo})`)
        .click({ force: true });
    cy.dataCy('story-footer').should('have.class', 'linked');
});

Cypress.Commands.add('createStoryGroup', ({ groupName = 'Groupo' } = {}) => {
    cy.visit('/project/bf/stories');
    cy.dataCy('add-item').click({ force: true });
    cy.dataCy('add-item-input')
        .find('input')
        .type(`${groupName}{enter}`);
});

Cypress.Commands.add('createStoryInGroup', ({ groupName = 'Groupo', storyName = null } = {}) => {
    findGroupAndOpenIfClosed(groupName);
    cy.dataCy('story-group-menu-item', groupName).then((n) => {
        if (n.next().attr('type') === 'story-group') cy.wrap([]).as('stories');
        else cy.wrap(n.nextUntil('[type="story-group"]')).as('stories');
    });
    cy.dataCy('story-group-menu-item', groupName)
        .findCy('add-story-in-story-group')
        .click({ force: true });
    cy.get('@stories').then((stories) => {
        findStoryAndSelect(`${groupName} (${stories.length + 1})`, 'new-story');
    });
    if (storyName) renameStoryOrGroup('new-story', storyName);
});

Cypress.Commands.add('deleteStoryOrGroup', (name = 'Groupo', type = null, confirm = true) => {
    const filter = type ? `[type="${type}"]` : null;
    cy.dataCy('story-group-menu-item', name, filter).should('exist')
        .findCy('delete-story-group').click({ force: true });
    if (confirm) cy.get('.modal').find('.primary.button').click({ force: true });
});

Cypress.Commands.add('renameStoryOrGroup', (name = 'Groupo', newName = 'Groupa', type = null) => {
    const filter = type ? `[type="${type}"]` : null;
    cy.dataCy('story-group-menu-item', name, filter).should('exist').as('found-item');
    renameStoryOrGroup('found-item', newName);
});

Cypress.Commands.add('toggleStoryGroupCollapsed', ({ groupName = 'Groupo' }) => {
    const filter = '[type="story-group"]';
    cy.dataCy('story-group-menu-item', groupName, filter).find('[data-cy=toggle-expansion-story-group]').click({ force: true });
});
