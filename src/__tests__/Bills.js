/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { bills } from "../fixtures/bills";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an Employee", () => {
	// Test for BillsUI.js
		describe("When I am on Bills page", () => {
			it("renders correctly the button and the title", () => {
				document.body.innerHTML = BillsUI({ data: [] });
				expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
				expect(screen.getByTestId("btn-new-bill")).toBeTruthy();
			});
		})
		describe("When I am on Bills page, and there are no bills", () => {
			it("Then, no bills should be shown", () => {
				document.body.innerHTML = BillsUI({ data: [] });
				const bill = screen.queryByTestId("bill");
				expect(bill).toBeNull();
			});
		});

		//ERREUR ICI
		describe("When I am on Bills page, there are bills", () => {
			it("should display a table of bills", () => {
				document.body.innerHTML = BillsUI({ data: bills });

        //Récupération des éléments du DOM en fonction de leur data-testid
				const bill = screen.getAllByTestId("bill");
				const type = screen.getAllByTestId("type")[0];
				const name = screen.getAllByTestId("name")[0];
				const date = screen.getAllByTestId("date")[0];
				const amount = screen.getAllByTestId("amount")[0];
				const status = screen.getAllByTestId("status")[0];
				const iconEye = screen.getAllByTestId("icon-eye")[0];

        //Test si les champs récupérés sont remplis
				expect(bill.length).not.toBeNull();
				expect(type.textContent).not.toBeNull();
				expect(name.textContent).not.toBeNull();
				expect(date.textContent).not.toBeNull();
				expect(amount.textContent).not.toBeNull();
				expect(status.textContent).not.toBeNull();
				expect(iconEye.textContent).not.toBeNull();
			});
		});

		describe("When I am on Bills page and the bills are displayed", () => {
			it("should be ordered from the earliest to the latest", () => {
				document.body.innerHTML = BillsUI({ data: bills });
				const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
				const antiChrono = (a, b) => (a < b ? 1 : -1);
				const datesSorted = [...dates].sort(antiChrono);
				expect(dates).toEqual(datesSorted);
			});
		});
		
	});

describe("Given I am connected as Employee and I am on Bill page, there are a newBill button", () => {
	describe("When clicking on newBill button", () => {
		it("The modal should be opened", () => {
			Object.defineProperty(window, "localStorage", { value: localStorageMock });
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);
			document.body.innerHTML = BillsUI({ data: [] });
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			const store = null;
			const bill = new Bills({
				document,
				onNavigate,
				store,
				localStorage: window.localStorage,
			});

			const handleClickNewBill = jest.fn(() => bill.handleClickNewBill());
			screen.getByTestId("btn-new-bill").addEventListener("click", handleClickNewBill);
			userEvent.click(screen.getByTestId("btn-new-bill"));
			expect(handleClickNewBill).toHaveBeenCalled();
			expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
		});
	});
});


// 1 Erreur là dedans
// Test d'intégration GET
	describe("When I navigate to Bills Dashboard", () => {
    //Avant de lancer le test on fait ça : 
		beforeEach(() => {
			jest.spyOn(mockStore, "bills");
			Object.defineProperty(window, "localStorage", { value: localStorageMock });
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
					email: "a@a",
				})
			);
			const root = document.createElement("div");
			root.setAttribute("id", "root");
			document.body.appendChild(root);
			router();
		});

		
		describe("When I am on Bills page, but it is loading", () => {
			it("Then, Loading page should be rendered", () => {
				document.body.innerHTML = BillsUI({ loading: true });
				expect(screen.getAllByText("Loading...")).toBeTruthy();
			});
		});
		
		describe("When I am on Dashboard page but back-end send an error message", () => {
			it("Then, Error page should be rendered", () => {
				document.body.innerHTML = BillsUI({ error: "some error message" });
				expect(screen.getAllByText("Erreur")).toBeTruthy();
			});
		});

		//ERREUR ICI
		it('fetches bills from mock API GET', async () => {
			// spy on Firebase Mock
			const getSpy = jest.spyOn(firebase, 'get');
	
			// get bills
			const bills = await firebase.get();
	
			// expected results
			expect(getSpy).toHaveBeenCalledTimes(1);
			expect(bills.data.length).toBe(4);
		  });

		it("Then, fetches bills from an API and fails with 404 message error", async () => {
			mockStore.bills.mockImplementationOnce(() => {
				return {
					list: () => {
						return Promise.reject(new Error("Erreur 404"));
					},
				};
			});
			window.onNavigate(ROUTES_PATH.Bills);
			await new Promise(process.nextTick);
			const message = await screen.getByText(/Erreur 404/);
			expect(message).toBeTruthy();
		});

		it("Then, fetches messages from an API and fails with 500 message error", async () => {
			mockStore.bills.mockImplementationOnce(() => {
				return {
					list: () => {
						return Promise.reject(new Error("Erreur 500"));
					},
				};
			});
			window.onNavigate(ROUTES_PATH.Bills);
			await new Promise(process.nextTick);
			const message = await screen.getByText(/Erreur 500/);
			expect(message).toBeTruthy();
		});
	});