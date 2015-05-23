# -*- coding: utf-8 -*-

from lxml import html
import requests, json, re, itertools

naverComicUrl = 'http://comic.naver.com'
naverComicListUrl = naverComicUrl + '/webtoon/creation.nhn?view=image'


def init_thumbnails():
	response = requests.get(naverComicListUrl)
	parsedBody = html.fromstring(response.text)
	thumbnailDivisions = parsedBody.xpath("//div[@class='thumb']")
	thumbnails = [{'title': td.xpath('./a/@title')[0], 'href': td.xpath('./a/@href')[0], 'imgsrc': td.xpath('./a/img/@src')[0], 'id': re.search('[0-9]+', td.xpath('./a/@href')[0]).group(0)} for td in thumbnailDivisions]

	for thumbnail in thumbnails:
		print 'Getting Stars from ' + thumbnail['title'].encode('utf-8')
		thumbnail['stars'] = makeStarList(thumbnail['href'])
		thumbnail['author'] = getAuthor(thumbnail['href'])

	with open('static/thumbnails.json', 'w') as fp:
		json.dump(thumbnails, fp)

def endPageNum(href):
	return int(html.fromstring(requests.get(naverComicUrl + href + '&page=1000').text).xpath("//span[@class='current']")[0].text)

def makeStarList(href):
	pages = [naverComicUrl + href + '&page=' + str(num) for num in xrange(1, endPageNum(href) + 1)]
	stars = list(itertools.chain(*[[float(star.text)
				for star
				in [x.xpath('./strong')[0]
					for x
					in html.fromstring(requests.get(page).text).xpath("//div[@class='rating_type']")]]
			for page
			in pages]))
	return stars[::-1]

def getAuthor(href):
	author = html.fromstring(requests.get(naverComicUrl + href).text).xpath("//span[@class='wrt_nm']")[0].text
	return author


if __name__ == '__main__':
	init_thumbnails()