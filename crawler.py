# -*- coding: utf-8 -*-

from lxml import html
import requests, json, re, itertools, sys

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

def missing_pages(tn):
	pages = [naverComicUrl + '/webtoon/detail.nhn?titleId=' + tn['id'] + '&no=' + str(num) for num in xrange(1, len(tn['stars']) + 1)]
	main_title = html.fromstring(requests.get('http://comic.naver.com/main.nhn').text).xpath('//head/title')[0].text
	mpgs = [i+1 for i, page in enumerate(pages) if html.fromstring(requests.get(page).text).xpath('//head/title')[0].text == main_title]
	print tn['title'].encode('utf-8'), mpgs
	return mpgs

def validation(start):
	with open('static/thumbnails.json', 'r') as fp:
		thumbnails = json.load(fp)
	for i in xrange(int(start), len(thumbnails)):
		t = thumbnails[i]
		thumbnail = {
			'author' : t['author'],
			'title' : t['title'],
			'href' : t['href'],
			'stars' : t['stars'],
			'imgsrc' : t['imgsrc'],
			'id' : t['id'],
			'missing' : [str(pn) for pn in missing_pages(t)]
		}
		thumbnails[i] = thumbnail
		with open('static/thumbnails.json', 'w') as fp:
			fp.write(thumbnails)
		print i, 'complete!'


if __name__ == '__main__':
	#init_thumbnails()
	validation(sys.argv[1])