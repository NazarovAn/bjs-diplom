"use strict";

const logoutBtn = new LogoutButton;

logoutBtn.action = () => ApiConnector.logout(result => {
    if(result){
        location.reload();
    }
    return;
});

ApiConnector.current((result) => {
    if(result.success){
        ProfileWidget.showProfile(result.data);      
    }
    return;
})

const tableBody = new RatesBoard;

function refreshStocks() {
    ApiConnector.getStocks((stocks) => {
        if(stocks.success){
            tableBody.clearTable();
            tableBody.fillTable(stocks.data)
        }
    });
    return;
}

refreshStocks();
setInterval(refreshStocks, 60000);

const moneyManager = new MoneyManager;

moneyManager.addMoneyCallback = (addMoneyForm) => ApiConnector.addMoney(addMoneyForm, (result) => {
    if(!result.success){
        moneyManager.setMessage(true, `Ошибка пополнения баланса`);
    } else {
        ProfileWidget.showProfile(result.data);
        moneyManager.setMessage(false, `Баланс успешно пополнен`);                       
    }    
    return;
});

moneyManager.conversionMoneyCallback = (conversionMoneyForm) => {
    ApiConnector.convertMoney(conversionMoneyForm, (result) => {
        if(conversionMoneyForm.targetCurrency === ``){                              //if нужен, т.к. ковертация проводится без указания цели.            
            moneyManager.setMessage(true, `Не указана целвевая валюта`);
        } else if(conversionMoneyForm.fromCurrency === ``){
            moneyManager.setMessage(true, `Не указана валюта для конвертации`);    //для красоты
        } else if(!result.success) {
            moneyManager.setMessage(true, `${result.data}`);
        } else {
            ProfileWidget.showProfile(result.data);
            moneyManager.setMessage(false, `Конвертация успешна`);            
        }
    return;
    })
}

moneyManager.sendMoneyCallback = (sendMoneyForm) => {
    ApiConnector.transferMoney(sendMoneyForm, (result) => {
        if(!result.success){
            moneyManager.setMessage(true, `Ошибка перевода`);
        } else {
            ProfileWidget.showProfile(result.data);
            moneyManager.setMessage(false, `Перевод успешно выплонен`);
        }
        return;        
    })
}

const favoritesTableBody = new FavoritesWidget;

ApiConnector.getFavorites((result) =>{
    if(result.success){
        favoritesTableBody.clearTable();
        favoritesTableBody.fillTable(result.data);
        moneyManager.updateUsersList(result.data);
    }    
})

console.log(favoritesTableBody);


favoritesTableBody.addUserCallback = ((addUserToFavoritesForm) => {
    ApiConnector.addUserToFavorites(addUserToFavoritesForm, (result) => {
        if(!result.success){
            favoritesTableBody.setMessage(true, result.data);
            return;
        } else {
            favoritesTableBody.clearTable();
            favoritesTableBody.fillTable(result.data);
            moneyManager.updateUsersList(result.data);
            favoritesTableBody.setMessage(false, `Пользователь добавлен`);
        }
        return;    
    })
})

favoritesTableBody.removeUserCallback = ((userToRemove) => {
    ApiConnector.removeUserFromFavorites(userToRemove, (result) => {
        if(!result.success){
            favoritesTableBody.setMessage(true, result.data);
            return;
        } else {
            favoritesTableBody.clearTable();
            favoritesTableBody.fillTable(result.data);
            moneyManager.updateUsersList(result.data);
            favoritesTableBody.setMessage(false, `Пользователь удалён`);
        }
        return;
    })
})