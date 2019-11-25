/* eslint-disable no-undef */
const ExpectedCellData = {
    conversationLength: [
        {
            table: 0, row: 0, column: 0, contents: 1,
        },
        {
            table: 0, row: 0, column: 1, contents: 1,
        },
        {
            table: 0, row: 0, column: 2, contents: '25%',
        },
        {
            table: 0, row: 1, column: 0, contents: 2,
        },
        {
            table: 0, row: 1, column: 1, contents: 2,
        },
        {
            table: 0, row: 1, column: 2, contents: '50%',
        },
        {
            table: 0, row: 2, column: 0, contents: 3,
        },
        {
            table: 0, row: 2, column: 1, contents: 1,
        },
        {
            table: 0, row: 2, column: 2, contents: '25%',
        },
    ],
    topIntents: [
        {
            table: 0, row: 0, column: 0, contents: 'test1',
        },
        {
            table: 0, row: 0, column: 1, contents: 5,
        },
        {
            table: 0, row: 0, column: 2, contents: '62.5%',
        },
        {
            table: 0, row: 1, column: 0, contents: 'test2',
        },
        {
            table: 0, row: 1, column: 1, contents: 2,
        },
        {
            table: 0, row: 1, column: 2, contents: '25%',
        },
    ],
    conversationDuration: [
        {
            table: 0, row: 0, column: 0, contents: '< 30',
        },
        {
            table: 0, row: 0, column: 1, contents: 1,
        },
        {
            table: 0, row: 0, column: 2, contents: '25%',
        },
        {
            table: 0, row: 1, column: 0, contents: '120 < 180',
        },
        {
            table: 0, row: 1, column: 1, contents: 2,
        },
        {
            table: 0, row: 1, column: 2, contents: '50%',
        },
        {
            table: 0, row: 2, column: 0, contents: '> 180',
        },
        {
            table: 0, row: 2, column: 1, contents: 1,
        },
        {
            table: 0, row: 2, column: 2, contents: '25%',
        },
    ],
    fallbackHourly: [
        {
            table: 0, row: 0, column: 0, contents: '00:00 - 00:59',
        },
        {
            table: 0, row: 0, column: 1, contents: 0,
        },
        {
            table: 0, row: 0, column: 2, contents: '0%',
        },
        {
            table: 0, row: 17, column: 0, contents: '17:00 - 17:59',
        },
        {
            table: 0, row: 17, column: 1, contents: 1,
        },
        {
            table: 0, row: 17, column: 2, contents: '50%',
        },
    ],
    fallbackThreeDay: [
        {
            table: 0, row: 0, column: 0, contents: '03/11/2019',
        },
        {
            table: 0, row: 0, column: 1, contents: 0,
        },
        {
            table: 0, row: 0, column: 2, contents: '0%',
        },
        {
            table: 0, row: 1, column: 0, contents: '04/11/2019',
        },
        {
            table: 0, row: 1, column: 1, contents: 1,
        },
        {
            table: 0, row: 1, column: 2, contents: '25%',
        },
        {
            table: 0, row: 2, column: 0, contents: '05/11/2019',
        },
        {
            table: 0, row: 2, column: 1, contents: 0,
        },
        {
            table: 0, row: 2, column: 2, contents: '0%',
        },
    ],
    fallbackLong: [
        {
            table: 0, row: 0, column: 0, contents: '15/08/2019',
        },
        {
            table: 0, row: 0, column: 1, contents: 0,
        },
        {
            table: 0, row: 0, column: 2, contents: '0%',
        },
        {
            table: 0, row: 1, column: 0, contents: '16/08/2019',
        },
        {
            table: 0, row: 1, column: 1, contents: 0,
        },
        {
            table: 0, row: 1, column: 2, contents: '0%',
        },
    ],
    VisitsHourly: [
        {
            table: 0, row: 0, column: 0, contents: '00:00 - 00:59',
        },
        {
            table: 0, row: 0, column: 1, contents: 0,
        },
        {
            table: 0, row: 0, column: 2, contents: 0,
        },
        {
            table: 0, row: 0, column: 3, contents: '0%',
        },
        {
            table: 0, row: 16, column: 0, contents: '16:00 - 16:59',
        },
        {
            table: 0, row: 16, column: 1, contents: 1,
        },
        {
            table: 0, row: 16, column: 2, contents: 1,
        },
        {
            table: 0, row: 16, column: 3, contents: '100%',
        },
    ],
};


describe('analytics tables', function() {
    beforeEach(function() {
        cy.deleteProject('bf');
        cy.createProject('bf', 'My Project', 'en').then(() => {
            cy.login();
        });
        cy.waitForResolve(Cypress.env('API_URL'));
        cy.importProject('bf', 'analytics_test_project.json');
    });

    afterEach(function() {
        cy.logout();
        cy.deleteProject('bf');
    });

    const verifyCellData = ({
        table, column, row, contents,
    }) => {
        cy.get('.table-chart')
            .eq(table)
            .find('.rt-tr-group')
            .eq(row)
            .find('.rt-td')
            .eq(column)
            .contains(contents)
            .should('exist');
    };
    const selectChartType = (chartSelector, cardIndex) => {
        cy.dataCy('chart-type-button')
            .find(chartSelector)
            .eq(cardIndex)
            .parent()
            .click();
    };
    
    it('should display the correct data in the conversation length table', function() {
        cy.visit('/project/bf/analytics');
        cy.pickDateRange(0, '5/11/2019', '4/11/2019');
        selectChartType('.table.icon', 0);
        ExpectedCellData.conversationLength.forEach((cellData) => {
            verifyCellData(cellData);
        });
    });

    
    it('should display the correct data in the top 10 intents  table', function() {
        cy.visit('/project/bf/analytics');
        cy.pickDateRange(1, '5/11/2019', '4/11/2019');
        selectChartType('.table.icon', 1);
        ExpectedCellData.topIntents.forEach((cellData) => {
            verifyCellData(cellData);
        });
    // RE-ENABLE THIS TEST WHEN NULL INTENT IS REMOVED
    //     cy.get('.table-chart')
    //         .find('.rt-td')
    //         .each((element) => {
    //                 cy.expect(element[0].childNodes[0].data.length).not.to.be.equal(0);
    //         });
    });
    it('should display the correct data in the conversation duration table', function() {
        cy.visit('/project/bf/analytics');
        cy.pickDateRange(2, '5/11/2019', '4/11/2019');
        selectChartType('.table.icon', 2);
        ExpectedCellData.conversationDuration.forEach((cellData) => {
            verifyCellData(cellData);
        });
    });
    it('should display the correct data in the fallback table', function() {
        cy.visit('/project/bf/analytics');
        cy.pickDateRange(3, '5/11/2019', '4/11/2019');
        selectChartType('.table.icon', 3);
        // test 1 day range
        cy.get('.table-chart')
            .eq(0)
            .find('.rt-tr-group')
            .should('have.length', 24);
        ExpectedCellData.fallbackHourly.forEach((cellData) => {
            verifyCellData(cellData);
        });
        // test 3 day range
        cy.pickDateRange(3, '3/11/2019', '5/11/2019');
        cy.get('.table-chart')
            .eq(0)
            .find('.rt-tr-group')
            .should('have.length', 3);
        ExpectedCellData.fallbackThreeDay.forEach((cellData) => {
            verifyCellData(cellData);
        });
        // test 91 day range
        cy.pickDateRange(3, '15/8/2019', '29/11/2019');
        ExpectedCellData.fallbackLong.forEach((cellData) => {
            verifyCellData(cellData);
        });
    });
    it('should display the correct data in the engagement table', function() {
        cy.visit('/project/bf/analytics');
        cy.pickDateRange(4, '5/11/2019', '4/11/2019');
        selectChartType('.table.icon', 4);
        ExpectedCellData.VisitsHourly.forEach((cellData) => {
            verifyCellData(cellData);
        });
    });
});
