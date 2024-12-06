package com.example.be.mapper.cs;

import com.example.be.dto.cs.inquiry.Inquiry;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CsMapper {

    @Insert("""
            INSERT INTO inquiry
                (category, writer, title, content, secret)
            VALUES (#{category}, #{writer}, #{title}, #{content}, #{secret})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertInquiry(Inquiry inquiry);

    @Select("""
            SELECT id, title, writer, updated
            FROM inquiry
            ORDER BY updated DESC
            """)
    List<Inquiry> selectAll();

    @Select("""
            SELECT *
            FROM inquiry
            WHERE id = #{id}
            """)
    Inquiry selectById(int id);
}
