// Tests unitaires pour la calculatrice (compatible Node.js et navigateur)

// Import pour Node.js
let Calculator, runTests;
if (typeof require !== 'undefined') {
    ({ Calculator, runTests } = require('./calculator.js'));
}

// Suite de tests complète
class CalculatorTestSuite {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.totalTests = 0;
    }

    // Méthode d'assertion
    assert(condition, message) {
        this.totalTests++;
        if (condition) {
            this.passedTests++;
            this.testResults.push({ status: 'PASS', message });
            console.log(`✅ ${message}`);
        } else {
            this.testResults.push({ status: 'FAIL', message });
            console.log(`❌ ${message}`);
        }
    }

    // Tests des opérations de base
    testBasicOperations() {
        console.log('\n🧮 Tests des opérations de base');
        
        const calc = new Calculator();
        
        // Test addition
        calc.clear();
        calc.inputNumber('5');
        calc.inputOperator('+');
        calc.inputNumber('3');
        calc.performCalculation();
        this.assert(calc.currentInput === '8', 'Addition: 5 + 3 = 8');

        // Test soustraction
        calc.clear();
        calc.inputNumber('10');
        calc.inputOperator('-');
        calc.inputNumber('4');
        calc.performCalculation();
        this.assert(calc.currentInput === '6', 'Soustraction: 10 - 4 = 6');

        // Test multiplication
        calc.clear();
        calc.inputNumber('6');
        calc.inputOperator('*');
        calc.inputNumber('7');
        calc.performCalculation();
        this.assert(calc.currentInput === '42', 'Multiplication: 6 × 7 = 42');

        // Test division
        calc.clear();
        calc.inputNumber('15');
        calc.inputOperator('/');
        calc.inputNumber('3');
        calc.performCalculation();
        this.assert(calc.currentInput === '5', 'Division: 15 ÷ 3 = 5');
    }

    // Tests des nombres décimaux
    testDecimalOperations() {
        console.log('\n🔢 Tests des nombres décimaux');
        
        const calc = new Calculator();
        
        // Test addition décimale
        calc.clear();
        calc.inputNumber('2');
        calc.inputDecimal();
        calc.inputNumber('5');
        calc.inputOperator('+');
        calc.inputNumber('1');
        calc.inputDecimal();
        calc.inputNumber('3');
        calc.performCalculation();
        this.assert(calc.currentInput === '3.8', 'Addition décimale: 2.5 + 1.3 = 3.8');

        // Test point décimal unique
        calc.clear();
        calc.inputNumber('5');
        calc.inputDecimal();
        calc.inputDecimal(); // Deuxième point ignoré
        calc.inputNumber('25');
        this.assert(calc.currentInput === '5.25', 'Point décimal unique: 5.25');
    }

    // Tests des cas d'erreur
    testErrorCases() {
        console.log('\n⚠️ Tests des cas d\'erreur');
        
        const calc = new Calculator();
        
        // Test division par zéro
        calc.clear();
        calc.inputNumber('5');
        calc.inputOperator('/');
        calc.inputNumber('0');
        calc.performCalculation();
        this.assert(calc.currentInput === 'Erreur', 'Division par zéro gérée');
    }

    // Tests des fonctions utilitaires
    testUtilityFunctions() {
        console.log('\n🛠️ Tests des fonctions utilitaires');
        
        const calc = new Calculator();
        
        // Test clear
        calc.inputNumber('123');
        calc.clear();
        this.assert(calc.currentInput === '0', 'Fonction clear');

        // Test backspace
        calc.inputNumber('123');
        calc.backspace();
        this.assert(calc.currentInput === '12', 'Fonction backspace');

        // Test backspace sur un seul chiffre
        calc.clear();
        calc.inputNumber('5');
        calc.backspace();
        this.assert(calc.currentInput === '0', 'Backspace sur un chiffre');
    }

    // Tests de l'historique
    testHistory() {
        console.log('\n📚 Tests de l\'historique');
        
        const calc = new Calculator();
        
        // Test ajout à l'historique
        calc.clear();
        calc.inputNumber('2');
        calc.inputOperator('+');
        calc.inputNumber('3');
        calc.performCalculation();
        this.assert(calc.history.length === 1, 'Ajout à l\'historique');
        this.assert(calc.history[0] === '2 + 3 = 5', 'Contenu de l\'historique correct');

        // Test effacement historique
        calc.clearHistory();
        this.assert(calc.history.length === 0, 'Effacement de l\'historique');
    }

    // Lancer tous les tests
    runAllTests() {
        console.log('🚀 Début des tests de la calculatrice\n');
        
        this.testBasicOperations();
        this.testDecimalOperations();
        this.testErrorCases();
        this.testUtilityFunctions();
        this.testHistory();
        
        console.log('\n📊 RÉSUMÉ DES TESTS');
        console.log(`Tests réussis: ${this.passedTests}/${this.totalTests}`);
        console.log(`Taux de réussite: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);
        
        if (this.passedTests === this.totalTests) {
            console.log('🎉 Tous les tests sont passés !');
        } else {
            console.log('⚠️ Certains tests ont échoué');
        }
        
        return {
            passed: this.passedTests,
            total: this.totalTests,
            success: this.passedTests === this.totalTests,
            results: this.testResults
        };
    }
}

// Fonction principale de test
function runCalculatorTests() {
    const testSuite = new CalculatorTestSuite();
    return testSuite.runAllTests();
}

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CalculatorTestSuite, runCalculatorTests };
}

// Auto-exécution dans le navigateur
if (typeof window !== 'undefined') {
    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        // Ajouter un bouton de test en mode développement
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const testButton = document.createElement('button');
            testButton.textContent = '🧪 Lancer les tests';
            testButton.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 1000;
                background: #007bff;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
            `;
            testButton.onclick = () => {
                const results = runCalculatorTests();
                const resultDiv = document.getElementById('test-results') || document.createElement('div');
                resultDiv.id = 'test-results';
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <strong>Tests: ${results.passed}/${results.total}</strong><br>
                    ${results.success ? '✅ Tous réussis' : '❌ Échecs détectés'}
                `;
                document.body.appendChild(resultDiv);
            };
            document.body.appendChild(testButton);
        }
    });
}