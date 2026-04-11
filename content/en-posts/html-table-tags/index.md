---
title: Creating Tables in HTML
date: "2023-03-28T01:00:00Z"
description: "MDN HTML Table Tutorial, Creating Tables"
tags: ["web", "study", "front", "HTML"]
---

This document discusses how to create tables using the `<table>` tag and its associated tags in HTML. HTML includes tags specifically designed for handling tabular data.

Content has been summarized from MDN tutorials. https://developer.mozilla.org/en/docs/Learn/HTML/Tables

# 1. Basics of HTML Tables

Tables allow for easy viewing and analysis of large amounts of data. While appropriate CSS styling contributes to creating effective tables, this section will focus solely on the basic structure of HTML tables.

## 1.1. Important Considerations

HTML tables should be used for displaying tabular data only, not for page layout. For instance, using a table tag to place a header, page content, and a footer is discouraged. 

Such practices originated from poor CSS support in browsers; they are now seen in some outdated websites. However, using CSS layouts (like flex, grid, etc.) is significantly more convenient today.

Moreover, using table tags for page layout introduces various issues, such as confusing screen reader users and complicating code maintenance. Layout tags like header and section get their width defined by the parent element, while table tags have their width determined by their content.

Consequently, arranging page layouts with table tags can result in broken layouts depending on the browser size, necessitating separate handling to ensure compatibility across various devices.

## 1.2. Creating a Table

Begin by acquiring the basic templates provided by MDN. Both an [HTML template](https://github.com/mdn/learning-area/blob/main/html/tables/basic/blank-template.html) and a [CSS template](https://github.com/mdn/learning-area/blob/main/html/tables/basic/minimal-table.css) are available. Although CSS has not yet been covered, these templates include basic styling to enhance table readability.

All table content is enclosed within the table tag, and the smallest container within the table is the table cell, represented by the `td` tag. Although not recommended, it is possible to create nested tables by inserting a `table` tag within another `table` tag.

```html
<table>
  <td>First Cell</td>
  <td>Second Cell</td>
  <td>Third Cell</td>
  <td>Fourth Cell</td>
</table>
```

When displaying this table, you will see that the `td` cells form a single row. Each subsequent `td` tag is placed in the same row as the previous `td` tag.

To resolve this, the `tr` tag should be used. The `tr` tag signifies a table row and serves to group the cells of a single row.

```html
<table>
  <tr>
    <td>First Cell</td>
    <td>Second Cell</td>
  </tr>
  <tr>
    <td>First Cell</td>
    <td>Second Cell</td>
  </tr>
</table>
```

If the number of `td` tags differs from row to row, the table will adjust to the length of the longest row.

## 1.3. Adding a Header

Typically, tables require headers to define what the data in the first row or column pertains to.

The cell for a header uses the `th` tag, which stands for table header. It functions similarly to the `td` tag but conveys the significance of a header. Thus, you can create a table with an appropriately assigned header as follows:

```html
<table>
  <tr>
    <th>Name</th>
    <th>Nickname</th>
  </tr>
  <tr>
    <td>Kim Seong-hyun</td>
    <td>Witch</td>
  </tr>
</table>
```

With the CSS template applied, the `th` tags will display with a gray background. Additionally, headers are typically center-aligned and boldfaced for distinction.

![header](./table-header.png)

Using table headers helps screen readers interpret header rows and columns as cohesive groups, thus benefiting users relying on screen reading technology.

## 1.4. Merging Rows and Columns

It may be desirable for a single cell to span multiple rows or columns. The `colspan` and `rowspan` attributes in `th` and `td` tags can be utilized for this purpose, allowing you to specify how many rows or columns a cell should occupy. By default, this is set to 1.

```html
<table>
  <tr>
    <th>First Column</th>
    <th>Second Column</th>
    <th colspan="2">Two-Column Cell</th>
    <th>Fourth Column</th>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
    <td>5</td>
  </tr>
</table>
```

## 1.5. Styling an Entire Column

Given their nature, there are occasions when it is necessary to emphasize or style an entire column. Here, the `colgroup` and `col` tags can be applied.

The `colgroup` tag should be placed right after the opening `table` tag to group entirety of columns for styling.

```html
<table>
  <colgroup>
    <col style="background-color: aqua" />
    <col />
    <col />
    <col style="background-color: aqua" />
  </colgroup>
  <tr>
    <th>First Column</th>
    <th>Second Column</th>
    <th colspan="2">Two-Column Cell</th>
    <th>Fourth Column</th>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
    <td>5</td>
  </tr>
</table>
```

If you wish to style only select columns, you must also include empty `col` tags for any columns that should remain unstyled. In the preceding example, styling applies to the 1st and 4th columns.

Furthermore, you can employ the `span` attribute to style multiple columns simultaneously.

# 2. Advanced HTML Tables

For further understanding, refer to the [MDN Advanced HTML Tables](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced).

This section covers captions and summaries for tables, grouping rows, creating table bodies/footers, and enhancing table accessibility.

## 2.1. Adding a Caption

A caption can be added to a table by inserting the `caption` tag immediately after the opening `table` tag. This placement is crucial.

This provides a description of the table, allowing readers to quickly grasp its purpose while also assisting screen-reader users.

```html
<table>
  <caption>
    Example Table.
  </caption>
  <tr>
    <th>First Category</th>
    <th>Second Category</th>
  </tr>
  <tr>
    <td>First Data</td>
    <td>First Data-2</td>
  </tr>
  <tr>
    <td>Second Data</td>
    <td>Second Data-2</td>
  </tr>
</table>
```

As a result, a title will be displayed above the table.

![caption](./table-caption.png)

To aid screen reader users, the table offers a `summary` attribute. However, this attribute is deprecated and not visible to general users, making the use of the `caption` tag the preferable option.

## 2.2. Advanced Table Structure

For tables with more complex structures, it can be beneficial to distinguish between the header, body, and footer of the table. To achieve this, the `thead`, `tbody`, and `tfoot` tags can be deployed.

This distinction does not enhance accessibility or user readability but can aid in establishing the table layout and styling, such as keeping the header and footer stationary while the body scrolls.

### 2.2.1. The `thead` Tag

The `thead` tag groups the header section of the table. It typically indicates the first row, though this is not strictly necessary. Moreover, it conventionally follows the opening table tag but should come after a `colgroup` tag if one is used.

```html
<table>
  <colgroup>
    <col />
    <col style="background-color: aqua" />
  </colgroup>
  <thead>
    <tr>
      <th>First Category</th>
      <th>Second Category</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>First Data</td>
      <td>First Data-2</td>
    </tr>
    <tr>
      <td>Second Data</td>
      <td>Second Data-2</td>
    </tr>
  </tbody>
</table>
```

### 2.2.2. The `tbody` Tag

The `tbody` tag encapsulates the body section of the table, referring to all parts excluding the header and footer.

### 2.2.3. The `tfoot` Tag

The `tfoot` tag groups the footer section of the table. It may represent the last row, which could display sums of previous rows, among other functions.

Typically placed at the end of the table tag, the `tfoot` tag may also appear just below the header tag, and browsers will render it at the bottom of the table accordingly.

```html
<table>
  <colgroup>
    <col />
    <col />
  </colgroup>
  <thead>
    <tr>
      <th>First Category</th>
      <th>Second Category</th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <td>First Total</td>
      <td>Second Total</td>
    </tr>
  </tfoot>

  <tbody>
    <tr>
      <td>First Data</td>
      <td>First Data-2</td>
    </tr>
    <tr>
      <td>Second Data</td>
      <td>Second Data-2</td>
    </tr>
  </tbody>
</table>
```

Even if the header and footer are placed prior to the `tbody`, rendering will occur in the header->body->footer sequence.

![structure](./table-structure.png)

In this case, the `tbody` is inherently included in every table. Even if it is not explicitly included, all tables will inherently contain a `tbody`.

If you create a table without a `tbody` and open it in a browser with the developer tools, you will observe that `tbody` has been automatically generated.

```html
<table>
  <td>Data 1</td>
  <td>Data 2</td>
</table>
```

Viewing this table in the developer tools will show the following.

![tbody](./table-tbody.png)

## 2.3. Accessibility

Screen reader users often find tables challenging to comprehend in a single glance. This difficulty arises because the screen reader interprets the table.

Therefore, structuring tables effectively is essential for aiding screen reader users. The screen reader recognizes all headers, linking them to their corresponding cells and helping to identify the association between headers and their respective data.

The `scope` attribute in `th` tags can be utilized for this purpose. The `scope` attribute indicates whether a header relates to a row or a column.

The `scope` attribute can hold the following values:

  * `row`: the header is associated with a row.
  * `col`: the header is associated with a column.
  * `rowgroup`: the header is associated with a group of rows.
  * `colgroup`: the header is associated with a group of columns.

This is particularly useful in complex tables where headers span multiple rows or columns.

```html
<table>
  <tr>
    <th colspan="2" scope="colgroup">Header 1</th>
    <th colspan="2" scope="colgroup">Header 2</th>
  </tr>
  <tr>
    <th scope="col">Header 1-1</th>
    <th scope="col">Header 1-2</th>
    <th scope="col">Header 2-1</th>
    <th scope="col">Header 2-2</th>
  </tr>
  <tr>
    <td>Content 1-1</td>
    <td>Content 1-2</td>
    <td>Content 2-1</td>
    <td>Content 2-2</td>
  </tr>
</table>
```

## 2.4. Using ID and Headers

As an alternative to the `scope` attribute, you can use `id` and `headers` attributes. Assign an `id` to the `th` tag and use the `headers` attribute in the `td` tag. The `headers` attribute should enumerate all corresponding `th` tags' `id` values, separated by spaces.

```html
<table>
  <tr>
    <th colspan="2" id="first-header">Header 1</th>
    <th colspan="2" id="second-header">Header 2</th>
  </tr>
  <tr>
    <th id="subheader1">Header 1-1</th>
    <th id="subheader2">Header 1-2</th>
    <th id="subheader3">Header 2-1</th>
    <th id="subheader4">Header 2-2</th>
  </tr>
  <tr>
    <td headers="first-header subheader1">Content 1-1</td>
    <td headers="first-header subheader2">Content 1-2</td>
    <td headers="second-header subheader3">Content 2-1</td>
    <td headers="second-header subheader4">Content 2-2</td>
  </tr>
</table>
```

This approach allows for a more precise association between headers and their respective data, though it is more complex and prone to errors. The use of the `scope` attribute is sufficient for most tables.

# 3. Creating a Table: Practical Example

MDN provides an example of creating a table using data about the planets in our solar system.

First, copy the [HTML template](https://github.com/mdn/learning-area/blob/main/html/tables/assessment-start/blank-template.html) and the [CSS template](https://github.com/mdn/learning-area/blob/main/html/tables/assessment-start/minimal-table.css) into your working directory. Then obtain the [planet data](https://github.com/mdn/learning-area/blob/main/html/tables/assessment-start/planets-data.txt).

Let’s create a table that organizes the planetary data.

## 3.1. Constructing the Table Structure

Create the table header, body, and add a caption.

```html
<table>
  <caption>
    Data about the planets of our solar system
  </caption>
  <thead></thead>
  <tbody></tbody>
</table>
```

Next, insert appropriate column headers into the `thead`. Additionally, include headers for each row, ensuring that the spans are adjusted as per the example table.

```html
<table>
  <caption>
    Data about the planets of our solar system
  </caption>
  <thead>
    <th colspan="2">&nbsp;</th>
    <th>Name</th>
    <th>Mass (10<sup>24</sup>kg)</th>
    <th>Diameter (km)</th>
    <th>Density (kg/m<sup>3</sup>)</th>
    <th>Gravity (m/s<sup>2</sup>)</th>
    <th>Length of day (hours)</th>
    <th>Distance from Sun (10<sup>6</sup>km)</th>
    <th>Mean temperature (°C)</th>
    <th>Number of moons</th>
    <th>Notes</th>
  </thead>
  <tbody>
    <tr>
      <th rowspan="4" colspan="2">Terrestrial planets</th>
      <th>Mercury</th>
    </tr>
    <tr>
      <th>Venus</th>
    </tr>
    <tr>
      <th>Earth</th>
    </tr>
    <tr>
      <th>Mars</th>
    </tr>
  </tbody>
  <tr>
    <th rowspan="4" colspan="1">Jovian planets</th>
    <th rowspan="2">Gas giants</th>
    <th>Jupiter</th>
  </tr>
  <tr>
    <th>Saturn</th>
  </tr>
  <tr>
    <th rowspan="2">Ice giants</th>
    <th>Uranus</th>
  </tr>
  <tr>
    <th>Neptune</th>
  </tr>
  <tr>
    <th colspan="2">Dwarf planets</th>
    <th>Pluto</th>
  </tr>
</table>
```

## 3.2. Inserting Planet Data to Complete the Table

Now, place the raw data in their respective positions. As the raw data is well categorized by planet, it should only require placing each value.

After this, don’t forget to assign the `scope` to each table header.

```html
<table>
  <caption>
    Data about the planets of our solar system
  </caption>
  <thead>
    <th colspan="2">&nbsp;</th>
    <th scope="col">Name</th>
    <th scope="col">Mass (10<sup>24</sup>kg)</th>
    <th scope="col">Diameter (km)</th>
    <th scope="col">Density (kg/m<sup>3</sup>)</th>
    <th scope="col">Gravity (m/s<sup>2</sup>)</th>
    <th scope="col">Length of day (hours)</th>
    <th scope="col">Distance from Sun (10<sup>6</sup>km)</th>
    <th scope="col">Mean temperature (°C)</th>
    <th scope="col">Number of moons</th>
    <th scope="col">Notes</th>
  </thead>
  <tbody>
    <tr>
      <th rowspan="4" colspan="2" scope="rowgroup">Terrestrial planets</th>
      <th scope="row">Mercury</th>
      <td>0.330</td>
      <td>4,879</td>
      <td>5,427</td>
      <td>3.7</td>
      <td>4222.6</td>
      <td>57.9</td>
      <td>167</td>
      <td>0</td>
      <td>Closest to the Sun</td>
    </tr>
    <tr>
      <th scope="row">Venus</th>
      <td>4.87</td>
      <td>12,104</td>
      <td>5,243</td>
      <td>8.9</td>
      <td>2802.0</td>
      <td>108.2</td>
      <td>464</td>
      <td>0</td>
      <td></td>
    </tr>
    <tr>
      <th scope="row">Earth</th>
      <td>5.97</td>
      <td>12,756</td>
      <td>5,514</td>
      <td>9.8</td>
      <td>24.0</td>
      <td>149.6</td>
      <td>15</td>
      <td>1</td>
      <td>Our world</td>
    </tr>
    <tr>
      <th scope="row">Mars</th>
      <td>0.642</td>
      <td>6,792</td>
      <td>3,933</td>
      <td>3.7</td>
      <td>24.7</td>
      <td>227.9</td>
      <td>-65</td>
      <td>2</td>
      <td>The red planet</td>
    </tr>
    <tr>
      <th rowspan="4" colspan="1" scope="rowgroup">Jovian planets</th>
      <th rowspan="2" scope="rowgroup">Gas giants</th>
      <th scope="row">Jupiter</th>
      <td>1898</td>
      <td>142,984</td>
      <td>1,326</td>
      <td>23.1</td>
      <td>9.9</td>
      <td>778.6</td>
      <td>-110</td>
      <td>67</td>
      <td>The largest planet</td>
    </tr>
    <tr>
      <th scope="row">Saturn</th>
      <td>568</td>
      <td>120,536</td>
      <td>687</td>
      <td>9.0</td>
      <td>10.7</td>
      <td>1433.5</td>
      <td>-140</td>
      <td>62</td>
      <td></td>
    </tr>
    <tr>
      <th rowspan="2" scope="rowgroup">Ice giants</th>
      <th scope="row">Uranus</th>
      <td>86.8</td>
      <td>51,118</td>
      <td>1271</td>
      <td>8.7</td>
      <td>17.2</td>
      <td>2872.5</td>
      <td>-195</td>
      <td>27</td>
      <td></td>
    </tr>
    <tr>
      <th scope="row">Neptune</th>
      <td>102</td>
      <td>49,528</td>
      <td>1638</td>
      <td>11.0</td>
      <td>16.1</td>
      <td>4495.1</td>
      <td>-200</td>
      <td>14</td>
      <td></td>
    </tr>
    <tr>
      <th colspan="2" scope="row">Dwarf planets</th>
      <th scope="row">Pluto</th>
      <td>0.0146</td>
      <td>2,370</td>
      <td>2095</td>
      <td>0.7</td>
      <td>153.3</td>
      <td>5906.4</td>
      <td>-225</td>
      <td>5</td>
      <td>
        Declassified as a planet in 2006, but this
        <a
          href="http://www.usatoday.com/story/tech/2014/10/02/pluto-planet-solar-system/16578959/"
          >remains controversial</a
        >
      </td>
    </tr>
  </tbody>
</table>
```

Now, let's add solid borders to the column containing the planet names. Since this is the 3rd column, apply the border style just to the 3rd column using the `colgroup`.

This should be done right after the `table` tag, before the `caption` tag.

```html
<colgroup>
  <col />
  <col />
  <col style="border: solid 2px" />
</colgroup>
```

After implementing these steps, the resulting table should match the assessment table provided.

![assessment](./table-assessment.png)