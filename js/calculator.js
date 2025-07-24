// Calculatrice JavaScript avec fonctionnalités avancées
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.historyList = document.getElementById('history-list');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.history = [];
    }

    // Méthode pour mettre à jour l'affichage
    updateDisplay() {
        this.display.value = this.currentInput;
    }

    // Ajouter un nombre
    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }

    // Ajouter un point décimal
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    // Effacer tout
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.updateDisplay();
    }

    // Effacer la dernière entrée
    clearEntry() {
        this.currentInput = '0';
        this.updateDisplay();
    }

    // Supprimer le dernier chiffre
    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    // Ajouter un opérateur
    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousInput || 0;
            const newValue = this.calculate(currentValue, inputValue, this.operator);

            this.currentInput = String(newValue);
            this.previousInput = newValue;
            this.updateDisplay();
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    }

    // Effectuer le calcul
    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                if (secondOperand === 0) {
                    throw new Error('Division par zéro impossible');
                }
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    // Exécuter le calcul final
    performCalculation() {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput !== '' && this.operator) {
            try {
                const result = this.calculate(this.previousInput, inputValue, this.operator);
                const calculation = `${this.previousInput} ${this.operator} ${inputValue} = ${result}`;
                
                this.addToHistory(calculation);
                this.currentInput = String(result);
                this.previousInput = '';
                this.operator = '';
                this.waitingForOperand = true;
                this.updateDisplay();
            } catch (error) {
                this.currentInput = 'Erreur';
                this.updateDisplay();
                console.error(error.message);
            }
        }
    }

    // Ajouter à l'historique
    addToHistory(calculation) {
        this.history.push(calculation);
        if (this.history.length > 10) {
            this.history.shift(); // Garder seulement les 10 derniers calculs
        }
        this.updateHistoryDisplay();
    }

    // Mettre à jour l'affichage de l'historique
    updateHistoryDisplay() {
        this.historyList.innerHTML = '';
        this.history.forEach(calc => {
            const li = document.createElement('li');
            li.textContent = calc;
            this.historyList.appendChild(li);
        });
    }

    // Effacer l'historique
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
    }
}

// Instance globale de la calculatrice
const calc = new Calculator();

// Fonctions globales pour les boutons HTML
function appendNumber(num) {
    if (num === '.') {
        calc.inputDecimal();
    } else {
        calc.inputNumber(num);
    }
}

function appendOperator(op) {
    calc.inputOperator(op);
}

function calculate() {
    calc.performCalculation();
}

function clearAll() {
    calc.clear();
}

function clearEntry() {
    calc.clearEntry();
}

function deleteDigit() {
    calc.backspace();
}

function clearHistory() {
    calc.clearHistory();
}

// Support du clavier
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (!isNaN(key) || key === '.') {
        appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteDigit();
    }
});

// Tests automatisés simples
function runTests() {
    console.log('🧪 Lancement des tests...');
    
    const tests = [
        // Test addition
        () => {
            calc.clear();
            calc.inputNumber('5');
            calc.inputOperator('+');
            calc.inputNumber('3');
            calc.performCalculation();
            return calc.currentInput === '8';
        },
        
        // Test soustraction
        () => {
            calc.clear();
            calc.inputNumber('10');
            calc.inputOperator('-');
            calc.inputNumber('4');
            calc.performCalculation();
            return calc.currentInput === '6';
        },
        
        // Test multiplication
        () => {
            calc.clear();
            calc.inputNumber('6');
            calc.inputOperator('*');
            calc.inputNumber('7');
            calc.performCalculation();
            return calc.currentInput === '42';
        },
        
        // Test division
        () => {
            calc.clear();
            calc.inputNumber('15');
            calc.inputOperator('/');
            calc.inputNumber('3');
            calc.performCalculation();
            return calc.currentInput === '5';
        }
    ];
    
    let passed = 0;
    tests.forEach((test, index) => {
        try {
            if (test()) {
                console.log(`✅ Test ${index + 1} : RÉUSSI`);
                passed++;
            } else {
                console.log(`❌ Test ${index + 1} : ÉCHOUÉ`);
            }
        } catch (error) {
            console.log(`❌ Test ${index + 1} : ERREUR - ${error.message}`);
        }
    });
    
    console.log(`📊 Résultat : ${passed}/${tests.length} tests réussis`);
    return passed === tests.length;
}

// Exporter pour les tests (si dans un environnement Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Calculator, runTests };
}