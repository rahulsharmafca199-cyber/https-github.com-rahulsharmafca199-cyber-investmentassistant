package com.rahulsharmafca199.investmentassistant

import android.os.Bundle
import android.view.View
import android.widget.Toast
import kotlin.math.pow
import androidx.appcompat.app.AppCompatActivity
import com.rahulsharmafca199.investmentassistant.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        setupInvestmentCalculator()
    }

    private fun setupInvestmentCalculator() {
        binding.btnCalculate.setOnClickListener {
            val principalText = binding.etPrincipal.text.toString()
            val rateText = binding.etRate.text.toString()
            val yearsText = binding.etYears.text.toString()

            if (principalText.isEmpty() || rateText.isEmpty() || yearsText.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val principal = principalText.toDoubleOrNull()
            val rate = rateText.toDoubleOrNull()
            val years = yearsText.toIntOrNull()

            if (principal == null || rate == null || years == null) {
                Toast.makeText(this, "Please enter valid numbers", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val finalAmount = calculateCompoundInterest(principal, rate / 100, years)
            val totalInterest = finalAmount - principal

            binding.tvResult.visibility = View.VISIBLE
            binding.tvResult.text = String.format(
                "Final Amount: ₹%.2f\nTotal Interest: ₹%.2f",
                finalAmount,
                totalInterest
            )
        }

        binding.btnClear.setOnClickListener {
            binding.etPrincipal.text?.clear()
            binding.etRate.text?.clear()
            binding.etYears.text?.clear()
            binding.tvResult.visibility = View.GONE
        }
    }

    private fun calculateCompoundInterest(principal: Double, rate: Double, years: Int): Double {
        return principal * (1 + rate).pow(years.toDouble())
    }
}
