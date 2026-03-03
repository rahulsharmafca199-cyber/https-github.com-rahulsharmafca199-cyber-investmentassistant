package com.investmentassistant;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private EditText etPrincipal;
    private EditText etRate;
    private EditText etYears;
    private TextView tvResult;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etPrincipal = findViewById(R.id.et_principal);
        etRate      = findViewById(R.id.et_rate);
        etYears     = findViewById(R.id.et_years);
        tvResult    = findViewById(R.id.tv_result);

        Button btnCalculate = findViewById(R.id.btn_calculate);
        btnCalculate.setOnClickListener(v -> calculate());
    }

    private void calculate() {
        String principalStr = etPrincipal.getText().toString().trim();
        String rateStr      = etRate.getText().toString().trim();
        String yearsStr     = etYears.getText().toString().trim();

        if (principalStr.isEmpty() || rateStr.isEmpty() || yearsStr.isEmpty()) {
            tvResult.setText(R.string.error_empty_fields);
            return;
        }

        double principal = Double.parseDouble(principalStr);
        double rate      = Double.parseDouble(rateStr) / 100.0;
        int    years     = Integer.parseInt(yearsStr);

        double amount = principal * Math.pow(1 + rate, years);
        double profit = amount - principal;

        tvResult.setText(getString(R.string.result_format,
                String.format("%.2f", amount),
                String.format("%.2f", profit)));
    }
}
