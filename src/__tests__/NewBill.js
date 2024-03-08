/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, fireEvent, getByTestId, waitFor } from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";
import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
	describe("When I am on Bills Page", () => {
	  test("Then email icon in vertical layout should be highlighted", async () => {
  
		Object.defineProperty(window, 'localStorage', { value: localStorageMock })
		window.localStorage.setItem('user', JSON.stringify({
		  type: 'Employee'
		}))
		const root = document.createElement("div")
		root.setAttribute("id", "root")
		document.body.append(root)
		router()
		window.onNavigate(ROUTES_PATH.NewBill)
		await waitFor(() => screen.getByTestId('icon-mail'))
		const mailIcon = screen.getByTestId('icon-mail')
		expect(mailIcon.className=="active-icon").toBeTruthy()
	  })
	})


	describe("When I am on newBill Page and I have sent the form", () => {
	  test("Then it should create a new bill", async () => {
		window.localStorage.setItem("user", JSON.stringify({ type: "Employee", status: "connected", }));
		const root = document.createElement("div");
		root.setAttribute("id", "root");
		document.body.append(root);
		router();
		window.onNavigate(ROUTES_PATH.NewBill);
  
		const dataCreated = jest.spyOn(mockStore.bills(), "create");
		const bill = {
			email: "employee@test.tld",
			type: "Hôtel et logement",
			name: "Hôtel",
			amount: 200,
			date: "2023-09-21",
			vat: "20",
			pct: 5,
			commentary: "",
			fileUrl: "testBill.png",
			fileName: "testBill",
			status: 'pending'
		  };
		//On utilise mockStore pour simuler lza création d'une facture
		await mockStore.bills().create(bill);
  
		//On s'attend à ce que la fonction create (mock) ait été exécuté
		expect(dataCreated).toHaveBeenCalled();
	  });
	});


	//On vérifie si le formulaire est bien rempli avec les données que l'on charge + test si appuie sur le bouton submit
	describe("When I am on NewBill Page, I fill the form and I submit", () => {
		test("Then the bill is added to API POST", async () => {
		  const html = NewBillUI()
		  document.body.innerHTML = html
	
		  const onNavigate = pathname => { document.body.innerHTML = ROUTES({ pathname }) }
		  Object.defineProperty(window, "localStorage", { value: localStorageMock })
		  const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
	
		  //On créé une facture fictive
		  const bill = {
			email: "employee@test.tld",
			type: "Hôtel et logement",
			name: "Hôtel",
			amount: 200,
			date: "2023-09-21",
			vat: "20",
			pct: 5,
			commentary: "",
			fileUrl: "testBill.png",
			fileName: "testBill",
			status: 'pending'
		  };
	
		  //Récupération des valeurs du formulaire
		  	const typeField = screen.getByTestId("expense-type")
			const nameField = screen.getByTestId("expense-name")
			const dateField = screen.getByTestId("datepicker")
			const amountField = screen.getByTestId("amount")
			const vatField = screen.getByTestId("vat")
			const pctField = screen.getByTestId("pct")
			const commentaryField = screen.getByTestId("commentary")

		  //Changement des valeurs
		  fireEvent.change(typeField, { target: { value: bill.type } })
		  fireEvent.change(nameField, { target: { value: bill.name } })
		  fireEvent.change(dateField, { target: { value: bill.date } })
		  fireEvent.change(amountField, { target: { value: bill.amount } })
		  fireEvent.change(vatField, { target: { value: bill.vat } })
		  fireEvent.change(pctField, { target: { value: bill.pct } })
		  fireEvent.change(commentaryField, { target: { value: bill.commentary } })

		  //Expect
		  expect(typeField.value).toBe(bill.type)
		  expect(nameField.value).toBe(bill.name) 
		  expect(dateField.value).toBe(bill.date)
		  expect(parseInt(amountField.value)).toBe(parseInt(bill.amount))	  
		  expect(parseInt(vatField.value)).toBe(parseInt(bill.vat))
		  expect(parseInt(pctField.value)).toBe(parseInt(bill.pct))
		  expect(commentaryField.value).toBe(bill.commentary)
	
		  const newBillForm = screen.getByTestId("form-new-bill")
		  
		  const handleChangeFile = jest.fn(newBill.handleChangeFile)
		  newBillForm.addEventListener("change", handleChangeFile)
		  const fileField = screen.getByTestId("file")
		  fireEvent.change(fileField, { target: { files: [ new File([bill.fileName], bill.fileUrl, { type: "image/png" }) ] } });
		  expect(fileField.files[0].name).toBe(bill.fileUrl) 
		  expect(handleChangeFile).toHaveBeenCalled()
	
		  const handleSubmit = jest.fn(newBill.handleSubmit)
		  newBillForm.addEventListener("submit", handleSubmit)
		  fireEvent.submit(newBillForm)
		  expect(handleSubmit).toHaveBeenCalled()
		});
	  });

	  describe("When an error occurs on API", () => {
		//Avant chaque test
		beforeEach(() => {
		  jest.spyOn(mockStore, "bills");
		  Object.defineProperty(window, "localStorage", { value: localStorageMock });
		  window.localStorage.setItem("user", JSON.stringify({
			type: "Employee",
			email: "a@a"
		  }))
		  const root = document.createElement("div")
		  root.setAttribute("id", "root")
		  document.body.appendChild(root)
		  router()
		})
  
		test("Then sends new bill to the API and fails with 404 message error", async () => {
		  const error = new Error("Erreur 404");
		  mockStore.bills.mockImplementationOnce(() => {
			return {
			  create: () => {
				return Promise.reject(new Error("Erreur 404"));
			  },
			};
		  });
  
		  window.onNavigate(ROUTES_PATH.NewBill);
		  await new Promise(process.nextTick);
		  await expect(mockStore.bills().create({})).rejects.toEqual(error);
		});
  
		test("Then sends new bill to the API and fails with 500 message error", async () => {
		  const error = new Error("Erreur 500");
		  mockStore.bills.mockImplementationOnce(() => {
			return {
			  create: () => {
				return Promise.reject(new Error("Erreur 500"));
			  },
			};
		  });
  
		  window.onNavigate(ROUTES_PATH.NewBill);
		  await new Promise(process.nextTick);
		  await expect(mockStore.bills().create({})).rejects.toEqual(error);
		});
  
	  });

});// FIN DE Connecté en tant qu'employé