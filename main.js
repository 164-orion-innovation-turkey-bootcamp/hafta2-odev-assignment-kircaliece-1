'use strict';

let isShopOpen;
let err = new Error();
let ingredients = ["tomato"];
let cookingTime;
let stock = {
    lettuce: 5,
    pickle: 5,
    onion: 5,
    meat: 5,
    chicken: 5,
    tomato: 5,
    bread: 5,
    potato: 5,
    coke: 5
}
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

async function hamburgerOrder(time, work) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(work === 'Take the order: ') {
                readline.question("What would you like to have in your hamburger? ", answer => {
                    ingredients = answer.split(" ");
                    readline.close();
                })
                resolve("Order Taken");
            } else if (work === 'Checking the stock') {
                try {
                    console.log(work);
                    checkTheStock().then(() => resolve());
                    resolve(work);
                } catch (err) {
                    console.error(err.message);
                    reject(work);
                }
            } else if (work === 'Meat or Chicken?') {
                choseMeat(work).then(() => {
                    resolve(work);
                });
            } else {
                console.log(work);
                resolve(work);
            }
        }, time);
    })
}

async function checkTheStock() {
    return new Promise((resolve => {
        isShopOpen = true;
        for (let stockKey in stock) {
            if(!stock[stockKey]) {
                isShopOpen = false;
                throw err = Error(`${stockKey} is not available in stock. Cannot take this order!`);
            }
        }
        resolve("Stock has enough ingredients!");
        return isShopOpen;
    }))
}

async function choseMeat(work) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    readline.question(`${work} Type m for Meat and c for Chicken. `, choice => {
        readline.close();
        let firstIngredient = choice === 'c' ? 'chicken' : 'meat'
        ingredients.push(firstIngredient);
        if (firstIngredient === 'meat') {
            return chooseCookingDegree().then(() => {});
        } else if (firstIngredient === 'chicken') {
            cookingTime = 3000;
            return hamburgerOrder(cookingTime, "Cooking the Chicken").then(() => {
                return prepareTheHamburger();
            })
        }
    });
    return cookingTime;
}

let prepareTheHamburger = () => {
    return new Promise((resolve) => {
        ingredients.forEach(ingredient => {
            stock[ingredient] -= 1;
            setTimeout(() => {
                console.log(`Adding ${ingredient}`);
            }, 1000);
        })
        resolve();
    }).then(() => {
        return hamburgerOrder(1000, ('Putting sauces and products to the tray'));
    }).then(() => {
        return hamburgerOrder(1000, 'Serve to the customer');
    })
        .finally(() => {
            return isShopOpen;
        })
}

let chooseCookingDegree = () => {
    return new Promise((resolve) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.question("Choose cooking degree for meat. 0 for Rare, 1 for Medium and 2 for Overcooked.", choice => {
            readline.close();
            if (choice === '0' || choice === '1' || choice === '2') {
                cookingTime = (parseInt(choice) + 2) * 1000;
                return hamburgerOrder(cookingTime, 'Cooking the Meat').then(() => {
                    resolve();
                    return prepareTheHamburger();
                })
            } else
                throw err = Error("Invalid Cooking Degree!");
        });
    })
}


do {
    readline.question("Do you want to order(y for yes): ", answer => {
        if (answer === 'y') {
            hamburgerOrder(1000, ("Take the order: "))
                .then(() => {
                    return hamburgerOrder(3000, ('Checking the stock'))
                })
                .then(() => {
                    return Promise.all([hamburgerOrder(1000, ('Meat or Chicken?')), hamburgerOrder(5000, 'Fry the Potatoes'), hamburgerOrder(2000, 'Prepare the Drink')]);
                })
                .catch((error) => console.log(error.message));
        }
        readline.close();
    });
} while(isShopOpen);