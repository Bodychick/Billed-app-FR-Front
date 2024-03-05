/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";

describe("Given I am connected as an employee", () => {
	describe("Then I am on NewBill page, there are a form", () => {
		it("Then, all the form input should be render correctly", async () => {
			document.body.innerHTML = NewBillUI();

      //On récupère les infos dans le DOM
			const formNewBill = screen.getByTestId("form-new-bill");
			const type = screen.getAllByTestId("expense-type");
			const name = screen.getAllByTestId("expense-name");
			const date = screen.getAllByTestId("datepicker");
			const amount = screen.getAllByTestId("amount");
			const vat = screen.getAllByTestId("vat");
			const pct = screen.getAllByTestId("pct");
			const commentary = screen.getAllByTestId("commentary");
			const file = screen.getAllByTestId("file");
			const submitBtn = document.querySelector("#btn-send-bill");


      //Si elles sont créés on regarde si elle existe
			expect(formNewBill).toBeTruthy();
			expect(type).toBeTruthy();
			expect(name).toBeTruthy();
			expect(date).toBeTruthy();
			expect(amount).toBeTruthy();
			expect(vat).toBeTruthy();
			expect(pct).toBeTruthy();
			expect(commentary).toBeTruthy();
			expect(file).toBeTruthy();
			expect(submitBtn).toBeTruthy();
		});
	});


	

	//Résolve
	describe("When I am on NewBill page, the user upload a pdf file", () => {
		it("Then, the file name should not be displayed", async () => {
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);

			document.body.innerHTML = NewBillUI();

			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			//const store = null;

			const newBill = new NewBill({
				document,
				onNavigate,
				store: mockStore.bills(),
				localStorage,
			});

			document.body.innerHTML=`<div id="root"></div>`;
			document.location='#employee/bill/new';
			await router();

			const handleChangeFile = jest.fn(newBill.handleChangeFile);
			const file = document.getByTestId("file");

			window.alert = jest.fn();

			file.addEventListener("change", handleChangeFile);
			fireEvent.change(file, {
				target: {
					files: [new File(["file.pdf"], "file.pdf", { type: "file/pdf" })],
				},
			});

			jest.spyOn(window, "alert");
			expect(alert).toHaveBeenCalled();

			expect(handleChangeFile).toHaveBeenCalled();
			expect(newBill.fileName).toBe(null);
			expect(newBill.isImgFormatValid).toBe(false);
			expect(newBill.formData).toBe(undefined);
		});
	});

	//ERREUR
	describe("When I am on NewBill page, and the user click on submit button", () => {
		test("Then, the handleSubmit function should be called", () => {
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);

			document.body.innerHTML = NewBillUI();

			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};

			const store = {
				bills: jest.fn(() => newBill.store),
				create: jest.fn(() => Promise.resolve({})),
			};

			const newBill = new NewBill({ document, onNavigate, store, localStorage });

			newBill.isImgFormatValid = true;

      //Récupération de tout le formulaire
			const formNewBill = screen.getByTestId("form-new-bill");
			const handleSubmit = jest.fn(newBill.handleSubmit);
    
      //On vérifie qu'une fonction se lance après le click button
			formNewBill.addEventListener("submit", handleSubmit);
			fireEvent.submit(formNewBill);

      //On s'attend à ce que la fonction ait été appelé
			expect(handleSubmit).toHaveBeenCalled();
		});
	});
});

//ERREUR x3
//POST
describe("When I navigate to Dashboard employee", () => {
	describe("Given I am a user connected as Employee, and a user post a newBill", () => {
		it("Add a bill from mock API POST", async () => {
			const postSpy = jest.spyOn(mockStore, "bills");
			const bill = {
				"id": "47qAXb6fIm2zOKkLzMro",
				"vat": "80",
				"fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
				"status": "pending",
				"type": "Hôtel et logement",
				"commentary": "séminaire billed",
				"name": "encore",
				"fileName": "preview-facture-free-201801-pdf-1.jpg",
				"date": "2004-04-04",
				"amount": 400,
				"commentAdmin": "ok",
				"email": "a@a",
				"pct": 20
			  };
			const postBills = await mockStore.bills().update(bill);
			expect(postSpy).toHaveBeenCalledTimes(1);
			expect(postBills).toStrictEqual(bill);
		});
		describe("When an error occurs on API", () => {
			beforeEach(() => {
				window.localStorage.setItem(
					"user",
					JSON.stringify({
						type: "Employee",
					})
				);

				document.body.innerHTML = NewBillUI();

				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname });
				};
			});
			it("Add bills from an API and fails with 404 message error", async () => {
				const postSpy = jest.spyOn(console, "error");

				const store = {
					bills: jest.fn(() => newBill.store),
					create: jest.fn(() => Promise.resolve({})),
					update: jest.fn(() => Promise.reject(new Error("404"))),
				};

				const newBill = new NewBill({ document, onNavigate, store, localStorage });
				newBill.isImgFormatValid = true;

				// Submit form
				const form = screen.getByTestId("form-new-bill");
				const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
				form.addEventListener("submit", handleSubmit);

				fireEvent.submit(form);
				await new Promise(process.nextTick);
				expect(postSpy).toBeCalledWith(new Error("404"));
			});
			it("Add bills from an API and fails with 500 message error", async () => {
				const postSpy = jest.spyOn(console, "error");

				const store = {
					bills: jest.fn(() => newBill.store),
					create: jest.fn(() => Promise.resolve({})),
					update: jest.fn(() => Promise.reject(new Error("500"))),
				};

				const newBill = new NewBill({ document, onNavigate, store, localStorage });
				newBill.isImgFormatValid = true;

				// Submit form
				const form = screen.getByTestId("form-new-bill");
				const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
				form.addEventListener("submit", handleSubmit);

				fireEvent.submit(form);
				await new Promise(process.nextTick);
				expect(postSpy).toBeCalledWith(new Error("500"));
			});
		});
	});
});