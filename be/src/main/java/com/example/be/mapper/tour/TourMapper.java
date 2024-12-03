package com.example.be.mapper.tour;

import com.example.be.dto.tour.Tour;
import com.example.be.dto.tour.TourList;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TourMapper {

    @Select("""
            SELECT id
            FROM tour
            WHERE partner=#{email}
            """)
    List<Integer> selectByPartner(String email);


    @Insert("""
            INSERT INTO tour
            (title, product, price, location, content, partner, partnerEmail)
            VALUES (#{title}, #{product}, #{price}, #{location}, #{content}, #{partner}, #{partnerEmail})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insert(Tour tour);

    @Select("""
              <script>
                  SELECT id, title, product, price, location, ti.name image
                  FROM tour t
                  LEFT JOIN tour_img ti ON t.id = ti.tour_id
                  WHERE
                    <trim prefixOverrides="OR">
                      <if test="searchType == 'all' or searchType == 'title'">
                          title LIKE CONCAT('%', #{keyword}, '%')
                      </if>
                      <if test="searchType == 'all' or searchType == 'product'">
                          OR product LIKE CONCAT('%', #{keyword}, '%')
                      </if>
                      <if test="searchType == 'all' or searchType == 'location'">
                          OR location LIKE CONCAT('%', #{keyword}, '%')
                      </if>
                      <if test="searchType == 'all' or searchType == 'partner'">
                          OR partner LIKE CONCAT('%', #{keyword}, '%')
                      </if>
                    </trim>
                  GROUP BY id
                  ORDER BY id DESC
              </script>
            """)
    List<TourList> selectAll(String searchType, String keyword);

    @Select("""
            SELECT *
            FROM tour
            WHERE id=#{id}
            """)
    Tour selectById(int id);

    @Delete("""
            DELETE FROM tour
            WHERE id=#{id}
            """)
    int deleteById(int id);

    @Update("""
            UPDATE tour
            SET title=#{title}, 
                product=#{product}, 
                price=#{price},
                location=#{location}, 
                content=#{content}
            WHERE id=#{id}
            """)
    int update(Tour tour);

    @Select("""
            SELECT nickname
            FROM member
            WHERE email=#{email}
            """)
    String findNickname(String name);

    @Insert("""
            INSERT INTO tour_img
            VALUES (#{id}, #{fileName})
            """)
    void insertFile(Integer id, String fileName);

    @Select("""
            SELECT name
            FROM tour_img
            WHERE tour_id=#{id}    
            """)
    List<String> selectFilesByTourId(int id);

    @Delete("""
            DELETE FROM tour_img
            WHERE tour_id=#{id}""")
    int deleteFileByTourId(int id);

    @Delete("""
            DELETE FROM tour_img
            WHERE tour_id=#{id}
              AND name=#{file}
            """)
    int deleteFileByTourIdAndName(Integer id, String file);

    @Insert("""
            INSERT INTO tour_cart 
            VALUES (#{id}, #{name})
            """)
    int addCart(Integer id, String name);

    @Delete("""
            DELETE FROM tour_cart
            WHERE tour_id=#{id}""")
    int deleteCartByTourId(int id);

    @Select("""
            SELECT COUNT(*)
            FROM tour_cart
            WHERE tour_id=#{id}
              AND member_email=#{partnerEmail}
            """)
    boolean checkCart(Integer id, String partnerEmail);

    @Select("""
            SELECT *
            FROM tour
            ORDER BY inserted DESC 
            LIMIT 4
            """)
    List<Tour> getTop4ByOrderByInserted();
}