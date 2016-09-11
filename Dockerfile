FROM centos:7

MAINTAINER	dvd.red@gmail.com
RUN useradd -ms /bin/bash shoutradio
RUN mkdir /opt/shoutserver
COPY ./sc_serv.conf /etc/sc_serv.conf
RUN curl http://download.nullsoft.com/shoutcast/tools/sc_serv2_linux_x64-latest.tar.gz | tar -xzC /opt/shoutserver/
RUN chown -R shoutradio. /opt/shoutserver && chmod 444 /etc/sc_serv.conf
WORKDIR /opt/shoutserver
EXPOSE [8000,8001]
USER shoutradio
CMD ["/opt/shoutserver/sc_serv", "/etc/sc_serv.conf"]
