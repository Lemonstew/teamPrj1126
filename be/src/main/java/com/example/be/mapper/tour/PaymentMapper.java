package com.example.be.mapper.tour;

import com.example.be.dto.tour.Payment;
import com.example.be.dto.tour.TourList;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PaymentMapper {

  @Insert("""
          INSERT INTO payment
          (payment_id, buyer_email, pay_method, currency, amount ) 
          VALUES (#{paymentId}, #{buyer}, #{paymentMethod}, #{currency}, #{amount})
          """)
  int insertPayment(Payment payment);

  @Insert("""
          INSERT INTO payment_detail
          (payment_id, tour_id, startDate, endDate, price)
          VALUES (#{paymentId}, #{id}, #{startDate}, #{endDate}, #{price})   
          """)
  int insertDetails(String paymentId, List<TourList> tourLists);
}
