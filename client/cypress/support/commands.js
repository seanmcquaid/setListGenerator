/// <reference types="cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

let clientToken;
let bandleaderToken;

Cypress.Commands.add("registerClient", () => {
    cy.server();

    cy.request("POST", "/users/register/client", {
        username : "testclient1234",
        password : "password1234",
        selectedBandleader : "testbandleader1234",
    }).then(({body}) => {
        clientToken = body.token;
    });
});

Cypress.Commands.add("getClientToken", () => clientToken);

Cypress.Commands.add("loginClient", () => {
    cy.get("[data-testid=ClientLinkButton]").click();

    cy.get("[data-testid=UsernameTextInput]").type("testclient1234");
    cy.get("[data-testid=UsernameTextInput]").should("have.value", "testclient1234");

    cy.get("[data-testid=PasswordTextInput]").type("password1234");
    cy.get("[data-testid=PasswordTextInput]").should("have.value", "password1234");

    cy.get('[data-testid=LoginButton]').click();

    cy.contains('Musical Preferences Page').should("be.visible");
});

Cypress.Commands.add("registerBandleader", () => {
    cy.server();

    cy.request("POST", "/users/register/bandleader", {
        username : "testbandleader1234",
        password : "password1234",
    }).then(({body}) => {
        bandleaderToken = body.token;
    });
});

Cypress.Commands.add("getBandleaderToken", () => bandleaderToken);

Cypress.Commands.add("loginBandleader", () => {
    cy.get("[data-testid=BandleaderLinkButton]").click();

    cy.get("[data-testid=UsernameTextInput]").type("testbandleader1234");
    cy.get("[data-testid=UsernameTextInput]").should("have.value", "testbandleader1234");

    cy.get("[data-testid=PasswordTextInput]").type("password1234");
    cy.get("[data-testid=PasswordTextInput]").should("have.value", "password1234");

    cy.get("[data-testid=LoginButton]").click();

    cy.contains("Band Leader Home Page").should("be.visible");
});

Cypress.Commands.add("deleteUser", username => {
    cy.server();

    cy.request("DELETE", "/users/deleteUser", {
        username,
    });

    cy.clearLocalStorage();
});

// clear all client info command

// clear all bandleader info command